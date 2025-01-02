import { NextApiRequest, NextApiResponse } from 'next'
import Iyzipay from 'iyzipay'
import db from '../../lib/db'
import jwt from 'jsonwebtoken'

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || '',
  secretKey: process.env.IYZICO_SECRET_KEY || '',
  uri: 'https://sandbox-api.iyzipay.com'
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
    const userId = decoded.id

    const { cardHolderName, cardNumber, expireMonth, expireYear, cvc, totalAmount } = req.body

    const user = await db.query('SELECT * FROM "Users" WHERE id = $1', [userId])

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const userData = user.rows[0]

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: Date.now().toString(),
      price: totalAmount,
      paidPrice: totalAmount,
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: 'B67832',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName,
        cardNumber,
        expireMonth,
        expireYear,
        cvc,
        registerCard: '0'
      },
      buyer: {
        id: userData.id.toString(),
        name: userData.name.split(' ')[0],
        surname: userData.name.split(' ')[1] || '',
        gsmNumber: userData.phone || '+905350000000',
        email: userData.email,
        identityNumber: userData.identity_number || '74300864791',
        lastLoginDate: userData.last_login ? new Date(userData.last_login).toISOString() : '2015-10-05 12:43:35',
        registrationDate: userData.created_at ? new Date(userData.created_at).toISOString() : '2015-10-05 12:43:35',
        registrationAddress: userData.address,
        ip: req.socket.remoteAddress || '',
        city: userData.city,
        country: userData.country,
        zipCode: userData.zipcode
      },
      shippingAddress: {
        contactName: userData.name,
        city: userData.city,
        country: userData.country,
        address: userData.address,
        zipCode: userData.zipcode
      },
      billingAddress: {
        contactName: userData.name,
        city: userData.city,
        country: userData.country,
        address: userData.address,
        zipCode: userData.zipcode
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Binocular',
          category1: 'Collectibles',
          category2: 'Accessories',
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: totalAmount
        }
      ]
    }

    iyzipay.payment.create(request, function (err, result) {
      if (err) {
        console.error('Iyzico error:', err)
        return res.status(500).json({ message: 'Payment failed', error: err })
      }

      if (result.status !== 'success') {
        console.error('Iyzico error:', result)
        return res.status(400).json({ message: 'Payment failed', error: result })
      }

      res.status(200).json({ status: 'success', message: 'Payment successful' })
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' })
    }
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

