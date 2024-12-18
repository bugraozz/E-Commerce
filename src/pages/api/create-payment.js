


import Iyzipay from 'iyzipay';
import db from '../../lib/db';
import jwt from 'jsonwebtoken';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

export default async function handler(req, res) {
  const requiredFields = ['Username', 'email', 'adress', 'city', 'country', 'zipcode', 'cardNumber', 'cardExpiry', 'cardCVC', 'totalAmount'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  const request = {
    locale: 'tr',
    conversationId: '123456789',
    price: req.body.totalAmount,
    paidPrice: req.body.totalAmount,
    currency: 'TRY',
    installment: 1,
    basketId: 'BASK12345',
    paymentGroup: 'PAYMENT_GROUP_1',
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/iyzico-callback`,
    buyer: {
      id: 'BUYER_12345',
      name: req.body.Username.split(' ')[0],
      surname: req.body.Username.split(' ').slice(1).join(' ') || 'Not Provided',
      gsmNumber: '',
      email: req.body.email,
      identityNumber: '11111111111',
      lastLoginDate: '2023-03-05 12:43:35',
      registrationDate: '2023-03-05 12:43:35',
      registrationAddress: req.body.adress,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      city: req.body.city,
      country: req.body.country,
      zipCode: req.body.zipcode
    },
    shippingAddress: {
      contactName: req.body.Username,
      city: req.body.city,
      country: req.body.country,
      address: req.body.adress,
      zipCode: req.body.zipcode
    },
    billingAddress: {
      contactName: req.body.Username,
      city: req.body.city,
      country: req.body.country,
      address: req.body.adress,
      zipCode: req.body.zipcode
    },
    basketItems: [
      {
        id: 'BI12345',
        name: 'Product Name',
        category1: 'Category 1',
        itemType: 'PHYSICAL',
        price: req.body.totalAmount,
        quantity: 1
      }
    ],
    paymentCard: {
      cardHolderName: req.body.Username,
      cardNumber: req.body.cardNumber,
      expiryMonth: req.body.cardExpiry.split('/')[0],
      expiryYear: '20' + req.body.cardExpiry.split('/')[1],
      cvc: req.body.cardCVC
    }
  };


  try {
    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.status !== 'success') {
      console.error('Iyzico error:', result);
      return res.status(400).json({ message: 'Payment initialization failed', error: result });
    }

    res.status(200).json({ paymentPageUrl: result.paymentPageUrl });
  } catch (error) {
    console.error('Iyzico error:', error);
    return res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
}




