
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
