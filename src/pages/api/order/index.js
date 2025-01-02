



import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../lib/db'
import Iyzipay from 'iyzipay'

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { token } = req.body

  try {
    // Retrieve payment result from iyzico
    iyzipay.checkoutForm.retrieve({
      locale: Iyzipay.LOCALE.TR,
      conversationId: '123456789',
      token: token
    }, async function (err, result) {
      if (err) {
        console.error('Iyzico error:', err)
        return res.status(500).json({ message: 'Payment verification failed' })
      }

      if (result.status === 'success') {
        // Payment is successful, proceed with order confirmation and stock reduction
        try {
          await db.query('BEGIN')

          // Insert order details into the database
          const orderResult = await db.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
            [result.basketId, result.price, 'completed']
          )
          const orderId = orderResult.rows[0].id

          // Insert order items and reduce stock
          for (const item of result.basketItems) {
            await db.query(
              'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
              [orderId, item.id, item.quantity, item.price]
            )

            // Reduce stock
            const stockResult = await db.query(
              'UPDATE product_sizes SET stock = stock - $1 WHERE product_id = $2 AND size = $3 RETURNING stock',
              [item.quantity, item.id, item.size]
            )

            if (stockResult.rows.length === 0 || stockResult.rows[0].stock < 0) {
              throw new Error(`Insufficient stock for product: id=${item.id}, size=${item.size}`)
            }
          }

          await db.query('COMMIT')

          res.status(200).json({ message: 'Order confirmed and stock updated successfully' })
        } catch (error) {
          await db.query('ROLLBACK')
          console.error('Error confirming order:', error)
          res.status(500).json({ message: 'Error confirming order', error: error.message })
        }
      } else {
        res.status(400).json({ message: 'Payment failed', error: result.errorMessage })
      }
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

