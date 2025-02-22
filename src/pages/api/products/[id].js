import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const query = `
        SELECT p.*, 
               array_agg(DISTINCT pi.image_url) as images,
               json_agg(json_build_object('size', ps.size, 'stock', ps.stock)) as sizes
        FROM "Products" p 
        LEFT JOIN "ProductImages" pi ON p.id = pi.product_id
        LEFT JOIN "ProductSizes" ps ON p.id = ps.product_id
        WHERE p.id = $1
        GROUP BY p.id
      `;
      
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Database error', details: error.message });
    }
  } else if (req.method === 'PUT') {
    const { name, price, images, category, description, sizes } = req.body;
    try {
      await db.query('BEGIN');

      await db.query(
        'UPDATE "Products" SET name = $1, price = $2, category = $3, description = $4 WHERE id = $5',
        [name, price, category, description, id]
      );

      await db.query('DELETE FROM "ProductImages" WHERE product_id = $1', [id]);
      for (let i = 0; i < images.length; i++) {
        await db.query(
          'INSERT INTO "ProductImages" (product_id, image_url, order_index) VALUES ($1, $2, $3)',
          [id, images[i], i]
        );
      }

      await db.query('DELETE FROM "ProductSizes" WHERE product_id = $1', [id]);
      for (const size of sizes) {
        await db.query(`
          INSERT INTO "ProductSizes" (product_id, size, stock)
          VALUES ($1, $2, $3)
          ON CONFLICT (product_id, size)
          DO UPDATE SET stock = EXCLUDED.stock
        `, [id, size.size, size.stock]);
      }

      await db.query('COMMIT');

      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === "DELETE") {
    try {
      await db.query("BEGIN");

      // Ürün resimlerini ve bedenlerini sil
      await db.query('DELETE FROM "ProductImages" WHERE product_id = $1', [id]);
      await db.query('DELETE FROM "ProductSizes" WHERE product_id = $1', [id]);
      
      // order_items tablosundaki ilgili kayıtları sil
      await db.query('DELETE FROM "order_items" WHERE product_id = $1', [id]);

      const result = await db.query('DELETE FROM "Products" WHERE id = $1 RETURNING *', [id]);

      await db.query("COMMIT");

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.status(200).json({ message: "Product deleted successfully", product: result.rows[0] });
      }
    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product", error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
