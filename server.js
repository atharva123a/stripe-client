const express = require('express');
const app = express();
// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51OQ1TsSJBSGLGgOb6gNn0sgAVKQpWf48voWMCL6dBOPPlr7jt4WbYA6u0nIQUBOFrMOLkHgMDQfTChENGEE8jVh800Fl49yOAT',
);

app.use(express.static('public'));
app.use(express.json());

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

function fetchCostFromOrderService() {
  return 1400;
}

app.post('/create-payment-intent', async (req, res) => {
  const { orderId } = req.body;

  const cost = fetchCostFromOrderService(orderId);
  const order = { cost: 10, currency: 'usd' };
  // Create a PaymentIntent with the order amount and currency
  // Set your secret key. Remember to switch to your live secret key in production.
  // See your keys here: https://dashboard.stripe.com/apikeys

  const customer = await stripe.customers.create({
    name: 'Jenny Rosen',
    address: {
      line1: '510 Townsend St',
      postal_code: '98140',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.cost,
    currency: order.currency,
    description: `Booking an eperience`,
    shipping: {
      name: 'Jenny Rosen',
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
      },
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
