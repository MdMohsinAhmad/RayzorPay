// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// app.post('/initiate-payment', async (req, res) => {
//     try {
//         const { amount, currency, customerEmail } = req.body;
//         const merchantReference = `ref-${Date.now()}`; // Generate a unique merchant reference

//         const paymentRequest = {
//             amount,
//             currency,
//             merchant_reference: merchantReference,
//             access_code:'your-Access-code',
//             merchant_identifier: 'your-merchant_identifier',
//             customer_email: customerEmail,
//             // Add other required parameters...
//         };

//         const response = await axios.post('https://sbpaymentservices.payfort.com/FortAPI/paymentApi', paymentRequest);

//         res.json({ paymentUrl: response.data.paymentUrl });
//     } catch (error) {
//         console.error('Payment initiation error:', error);
//         res.status(500).json({ error: 'Payment initiation error' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Backend service is running on http://localhost:${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');
// require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
    key_id: 'rzp_test_aVQO31vAmj27ct',
    key_secret:'coNKrzSle0KbYaIUJDPZKnfh',
});

app.post('/create-order', async (req, res) => {
    const { amount, currency } = req.body;
    const options = {
        amount: amount *100, // amount in the smallest currency unit
        currency: currency,
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
        console.log(order)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
