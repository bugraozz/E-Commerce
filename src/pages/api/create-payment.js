



// import Iyzipay from 'iyzipay';
// import db from '../../lib/db';
// import jwt from 'jsonwebtoken';

// const iyzipay = new Iyzipay({
//   apiKey: process.env.IYZICO_API_KEY,
//   secretKey: process.env.IYZICO_SECRET_KEY,
//   uri: 'https://sandbox-api.iyzipay.com'
// });

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const requiredFields = ['Username', 'email', 'phone', 'address', 'city', 'country', 'zipCode', 'cardNumber', 'cardExpiry', 'cardCVC', 'totalAmount'];
//   const missingFields = requiredFields.filter(field => !req.body[field]);

//   if (missingFields.length > 0) {
//     return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
//   }

//   const request = {
//     locale: Iyzipay.LOCALE.TR,
//     conversationId: `conv_${Date.now()}`,
//     price: req.body.totalAmount,
//     paidPrice: req.body.totalAmount,
//     currency: Iyzipay.CURRENCY.TRY,
//     installment: '1',
//     basketId: `basket_${Date.now()}`,
//     paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
//     paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
//     callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/iyzico-callback`,
//     buyer: {
//       id: `buyer_${Date.now()}`,
//       name: req.body.Username.split(' ')[0],
//       surname: req.body.Username.split(' ').slice(1).join(' ') || 'Not Provided',
//       gsmNumber: req.body.phone,
//       email: req.body.email,
//       identityNumber: '74300864791',
//       lastLoginDate: '2015-10-05 12:43:35',
//       registrationDate: '2013-04-21 15:12:09',
//       registrationAddress: req.body.address,
//       ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
//       city: req.body.city,
//       country: req.body.country,
//       zipCode: req.body.zipCode
//     },
//     shippingAddress: {
//       contactName: req.body.Username,
//       city: req.body.city,
//       country: req.body.country,
//       address: req.body.address,
//       zipCode: req.body.zipCode
//     },
//     billingAddress: {
//       contactName: req.body.Username,
//       city: req.body.city,
//       country: req.body.country,
//       address: req.body.address,
//       zipCode: req.body.zipCode
//     },
//     basketItems: [
//       {
//         id: `item_${Date.now()}`,
//         name: 'Binocular',
//         category1: 'Collectibles',
//         category2: 'Accessories',
//         itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
//         price: req.body.totalAmount
//       }
//     ]
//   };

//   try {
//     const result = await new Promise((resolve, reject) => {
//       iyzipay.checkoutFormInitialize.create(request, function (err, result) {
//         if (err) {
//           console.error('Iyzipay error:', err);
//           reject(err);
//         } else {
//           console.log('Iyzipay result:', result);
//           resolve(result);
//         }
//       });
//     });

//     if (result.status === 'success') {
//       res.status(200).json({ paymentPageUrl: result.paymentPageUrl });
//     } else {
//       console.error('Iyzipay error:', result);
//       res.status(400).json({ message: 'Payment initialization failed', error: result });
//     }
//   } catch (error) {
//     console.error('Payment initialization error:', error);
//     res.status(500).json({ message: 'Payment initialization failed', error: error.message });
//   }
// }



function formatDate(date) {
  return date.toISOString().replace('T', ' ').split('.')[0];
}

import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: 'https://sandbox-api.iyzipay.com'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { items, ...buyerInfo } = req.body;

  console.log('Received payment request:', JSON.stringify({ items, buyerInfo }, null, 2));

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty items array' });
  }

  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);

  // Ensure NEXT_PUBLIC_BASE_URL is set
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error('NEXT_PUBLIC_BASE_URL is not set');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: `conv_${Date.now()}`,
    price: totalAmount,
    paidPrice: totalAmount,
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: `basket_${Date.now()}`,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/iyzico-callback`,
    buyer: {
      id: `buyer_${Date.now()}`,
      name: buyerInfo.Username.split(' ')[0],
      surname: buyerInfo.Username.split(' ').slice(1).join(' ') || 'Not Provided',
      gsmNumber: buyerInfo.phone,
      email: buyerInfo.email,
      identityNumber: buyerInfo.identityNumber || '11111111111',
      lastLoginDate: formatDate(new Date()),
      registrationDate: formatDate(new Date()),
      registrationAddress: buyerInfo.address || 'Not Provided',
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      city: buyerInfo.city,
      country: buyerInfo.country,
      zipCode: buyerInfo.zipCode || '00000'
    },
    shippingAddress: {
      contactName: buyerInfo.Username,
      city: buyerInfo.city,
      country: buyerInfo.country,
      address: buyerInfo.address || 'Not Provided',
      zipCode: buyerInfo.zipCode || '00000'
    },
    billingAddress: {
      contactName: buyerInfo.Username,
      city: buyerInfo.city,
      country: buyerInfo.country,
      address: buyerInfo.address || 'Not Provided',
      zipCode: buyerInfo.zipCode || '00000'
    },
    basketItems: items.map(item => ({
      id: item.id.toString(),
      name: item.name,
      category1: item.category,
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: parseFloat(item.price).toFixed(2)
    }))
  };

  console.log('Iyzipay request:', JSON.stringify(request, null, 2));

  try {
    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, function (err, result) {
        if (err) {
          console.error('Iyzipay error:', err);
          reject(err);
        } else {
          console.log('Iyzipay result:', JSON.stringify(result, null, 2));
          resolve(result);
        }
      });
    });

    if (result.status === 'success') {
      res.status(200).json({ paymentPageUrl: result.paymentPageUrl });
    } else {
      console.error('Iyzipay error:', result);
      res.status(400).json({ message: 'Payment initialization failed', error: result });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
}

