
import React, { useState } from 'react';
import axios from 'axios';

const PaymentWebView = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState(0);

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const result = await axios.post('http://localhost:3001/create-order', {
            amount: amount,
            currency: 'INR',
        });

        if (!result) {
            alert('Server error. Are you online?');
            return;
        }

        const { amount: orderAmount, id: orderId, currency } = result.data;

        const options = {
          key_id: 'rzp_test_aVQO31vAmj27ct',
          // key_secret:'coNKrzSle0KbYaIUJDPZKnfh', // Enter the Key ID generated from the Dashboard
            amount: orderAmount,
            currency: currency,
            name: 'Finesse',
            description: 'Test Transaction',
            order_id: orderId,
            handler: async function (response) {
                alert('Payment successful');
                console.log(response);
            },
            prefill: {
                name: name,
                email: email,
            },
            notes: {
                address: 'Razorpay Corporate Office',
            },
            theme: {
                color: '#3399cc',
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div style={{ padding: '50px' }}>
            <h2>Razorpay Payment Integration</h2>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '10px', margin: '10px' }}
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px', margin: '10px' }}
                />
            </div>
            <div>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ padding: '10px', margin: '10px' }}
                />
            </div>
            <button onClick={handlePayment} style={{ padding: '10px', margin: '10px' }}>
                Pay Now
            </button>
        </div>
    );
};

export default PaymentWebView;
