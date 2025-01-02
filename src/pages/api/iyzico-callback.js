import Iyzipay from 'iyzipay';
import db from '../../lib/db';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    console.error('Token is missing in the request body');
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    console.log('Retrieving payment with token:', token);
    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutForm.retrieve({
        locale: Iyzipay.LOCALE.TR,
        conversationId: `${Date.now()}`,
        token: token
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log('Iyzico payment result:', result);

    if (result.paymentStatus === 'SUCCESS') {
      const { basketId, price, paidPrice, paymentId, basketItems } = result;
      
      const client = await db.connect();
      try {
        await client.query('BEGIN');

        console.log('Saving order to database...');
        const orderResult = await client.query(
          'INSERT INTO orders (user_id, total_amount, status, payment_id) VALUES ($1, $2, $3, $4) RETURNING id',
          [basketId, paidPrice, 'completed', paymentId]
        );
        const orderId = orderResult.rows[0].id;
        console.log('Order saved with ID:', orderId);

        for (const item of basketItems) {
          console.log('Processing item:', item);
          await client.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES ($1, $2, $3, $4, $5)',
            [orderId, item.id, item.quantity, item.price, item.size]
          );

          const updateStockResult = await client.query(
            'UPDATE "ProductSizes" SET stock = stock - $1 WHERE product_id = $2 AND size = $3 RETURNING stock',
            [item.quantity, item.id, item.size]
          );

          if (updateStockResult.rows.length === 0) {
            throw new Error(`Product not found: id=${item.id}, size=${item.size}`);
          }

          const newStock = updateStockResult.rows[0].stock;
          console.log(`Updated stock for product ${item.id}, size ${item.size}: ${newStock}`);

          if (newStock < 0) {
            throw new Error(`Insufficient stock for product: id=${item.id}, size=${item.size}`);
          }
        }

        await client.query('COMMIT');
        console.log('Transaction committed successfully');
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in database transaction:', error);
        throw error;
      } finally {
        client.release();
      }

      return res.redirect(307, '/payment-success');
    } else {
      console.log('Payment failed:', result.errorMessage);
      return res.redirect(307, '/payment-failed');
    }
  } catch (error) {
    console.error('Iyzico callback error:', error);
    return res.redirect(307, '/payment-error');
  }
}

