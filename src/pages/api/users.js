import db from '../../lib/db';

export default async function handler(req, res) {
  // Gelen isteği logla
  console.log(`Received ${req.method} request`);

  if (req.method === 'POST') {
    const { Username, Password } = req.body;
    console.log(`Login attempt with Username: ${Username}`); // Kullanıcı adı logu

    // Burada gelen kullanıcı adı ve şifreyi logla
    console.log(`Username: ${Username}, Password: ${Password}`);

    try {
      // Kullanıcıyı veritabanından kontrol et
      const result = await db.query(
        'SELECT * FROM "Users" WHERE "Username" = $1',
        [Username]
      );

      console.log('Veritabanı sorgu sonucu:', result.rows); // Veritabanı sorgu sonucu logu

      if (result.rows.length > 0) {
        // Kullanıcı bulundu, şifreyi kontrol et
        const user = result.rows[0];

        // Şifre kontrolü (hashlenmemiş şifreyi doğrudan karşılaştır)
        if (user.Password.trim() === Password) { // trim() kullanarak yeni satır karakterini kaldır
          // Şifre doğru ise başarılı giriş
          console.log(`Login successful for Username: ${Username}`);
          res.status(200).json({ message: 'Login successful', user });
        } else {
          // Şifre yanlış ise hata
          console.log(`Invalid credentials for Username: ${Username}`);
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        // Kullanıcı bulunamadı, hata
        console.log(`Invalid credentials for Username: ${Username}`);
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'GET') {
    try {
      // Tüm kullanıcıları al
      const result = await db.query('SELECT * FROM "Users"');
      console.log(`Retrieved ${result.rows.length} "Users" from database`); // Tüm kullanıcıları logla
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    // Diğer istek yöntemlerini reddet
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
