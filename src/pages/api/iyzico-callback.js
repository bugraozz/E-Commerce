import Iyzipay from 'iyzipay';
import { Pool } from 'pg';
import { verifyAuth } from '@/lib/auth';

let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  console.log('Database pool created successfully');
} catch (error) {
  console.error('Error creating database pool:', error);
}

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

export default async function handler(req, res) {
  console.log('Callback request body:', JSON.stringify(req.body, null, 2));
  console.log('Callback request query:', JSON.stringify(req.query, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.query.authToken;
  if (!token || token === 'undefined') {
    console.log('Invalid or missing authorization token');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const authResult = verifyAuth({ headers: { authorization: `Bearer ${decodeURIComponent(token)}` } });

 

  if (!authResult.authenticated) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = authResult.userId;
  let paymentToken = req.body.token || req.query.token;

  if (!paymentToken) {
    console.error('Token is missing in both request body and query');
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    console.log('Retrieving payment with token:', paymentToken);
    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({
        locale: Iyzipay.LOCALE.TR,
        conversationId: `${Date.now()}`,
        token: paymentToken
      }, (err, result) => {
        if (err) {
          console.error('Iyzico retrieve error:', err);
          reject(err);
        } else {
          console.log('Iyzico retrieve result:', JSON.stringify(result, null, 2));
          resolve(result);
        }
      });
    });

    console.log('Iyzico payment result:', JSON.stringify(result, null, 2));

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      const { basketId, price, paidPrice, paymentId, itemTransactions } = result;
      
      if (!pool) {
        console.error('Database pool is not initialized');
        return res.redirect(302, '/payment-error?error=database_connection_failed');
      }

      let client;
      try {
        client = await pool.connect();
        console.log('Connected to database successfully');
        await client.query('BEGIN');

        console.log('Saving order to database...');
        const orderResult = await client.query(
          'INSERT INTO orders (user_id, basket_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
          [userId, basketId, paidPrice, 'completed']
        );
        const orderId = orderResult.rows[0].id;
        console.log('Order saved with ID:', orderId);

        // Save payment details separately if needed
        await client.query(
          'INSERT INTO payments (order_id, payment_id, amount) VALUES ($1, $2, $3)',
          [orderId, paymentId, paidPrice]
        );

        console.log('Item transactions:', JSON.stringify(itemTransactions, null, 2));
        for (const item of itemTransactions) {
          console.log('Processing item:', JSON.stringify(item, null, 2));
          const quantity = item.itemQuantity || 1; 
          await client.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
            [orderId, item.itemId, quantity, item.paidPrice]
          );

          const updateStockResult = await client.query(
            'UPDATE "ProductSizes" SET stock = stock - $1 WHERE product_id = $2 RETURNING stock',
            [quantity, item.itemId]
          );

          if (updateStockResult.rows.length === 0) {
            throw new Error(`Product not found: id=${item.itemId}`);
          }

          const newStock = updateStockResult.rows[0].stock;
          console.log(`Updated stock for product ${item.itemId}: ${newStock}`);

          if (newStock < 0) {
            throw new Error(`Insufficient stock for product: id=${item.itemId}`);
          }
        }

        await client.query('COMMIT');
        console.log('Transaction committed successfully');
        return res.redirect(302, '/payment-success');
      } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error('Error in database transaction:', error);
        return res.redirect(302, `/payment-error?error=${encodeURIComponent(error.message)}`);
      } finally {
        if (client) client.release();
      }
    } else {
      console.log('Payment failed:', result.errorMessage);
      return res.redirect(302, `/payment-failed?error=${encodeURIComponent(result.errorMessage)}`);
    }
  } catch (error) {
    console.error('Iyzico callback error:', error);
    return res.redirect(302, `/payment-error?error=${encodeURIComponent(error.message)}`);
  }
}

