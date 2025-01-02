
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import db from '@/lib/db'

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.JWT_SECRET })

    if (!token) {
      console.log('Token not found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = token.sub
    console.log('Fetching orders for user:', userId)

    const result = await db.query(`
      SELECT o.id, o.created_at as date, o.total_amount, o.status,
             oi.product_id, oi.quantity, oi.price, oi.size,
             p.name as product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [userId])

    console.log('Query result:', result.rows)

    const orders = result.rows.reduce((acc, row) => {
      const orderIndex = acc.findIndex(order => order.id === row.id)
      if (orderIndex === -1) {
        acc.push({
          id: row.id,
          date: row.date,
          totalAmount: row.total_amount,
          status: row.status,
          items: [{
            id: row.product_id,
            name: row.product_name,
            price: row.price,
            quantity: row.quantity,
            size: row.size
          }]
        })
      } else {
        acc[orderIndex].items.push({
          id: row.product_id,
          name: row.product_name,
          price: row.price,
          quantity: row.quantity,
          size: row.size
        })
      }
      return acc
    }, [])

    console.log('Processed orders:', orders)

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
