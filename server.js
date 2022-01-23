const stripe = require('stripe')
  (process.env.STRIPE_SECRET);
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
// app.use(express.static('public'));
// const YOUR_DOMAIN = 'http://localhost:3000';

app.enable('trust proxy');
app.use(express.static(path.join(__dirname, 'build')));

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: req.query.priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.hostname}?success=true`,
    cancel_url: `${req.protocol}://${req.hostname}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.get('/get-all-products', async (req, res) => {
  const products = await stripe.prices.list({
    limit: 3,
    active: true,
    expand: ['data.product']
  });
  res.status(200).json(products.data);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Running on port ${port}`));