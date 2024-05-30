// import React, { useState } from 'react';
// import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';
// import axios from 'axios';

// const PaymentWebView = ({ navigation }) => {
//     const [showWebView, setShowWebView] = useState(false);
//     const [paymentUrl, setPaymentUrl] = useState('');

//     const handlePayment = async () => {
//         try {
//             // Mock payment request for demonstration purposes
//             const paymentRequest = {
//                 amount: '100',
//                 currency: 'USD',
//                 merchantReference: 'your-merchant-reference',
//                 accessCode: 'your-access-code',
//                 merchantIdentifier: 'your-merchant-identifier',
//                 customerEmail: 'customer@example.com',
//                 // Add other required parameters...
//             };

//             // Make request to backend to initiate payment
//             const response = await axios.post('http://localhost:3000/initiate-payment', paymentRequest);

//             // Set payment URL received from backend
//             setPaymentUrl(response.data.paymentUrl);
//             setShowWebView(true);
//         } catch (error) {
//             console.error('Payment initiation error:', error);
//         }
//     };

//     if (showWebView && paymentUrl) {
//         return (
//             <WebView
//                 source={{ uri: paymentUrl }}
//                 onNavigationStateChange={(event) => {
//                     if (event.url.includes('payment-success')) {
//                         // Handle payment success
//                         setShowWebView(false);
//                         navigation.goBack(); // Go back to the previous screen
//                     } else if (event.url.includes('payment-failure')) {
//                         // Handle payment failure
//                         setShowWebView(false);
//                         navigation.goBack(); // Go back to the previous screen
//                     }
//                 }}
//             />
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <TextInput style={styles.input} placeholder="Name" />
//             <TextInput style={styles.input} placeholder="Email" />
//             <TextInput style={styles.input} placeholder="Card Number" />
//             <TextInput style={styles.input} placeholder="Expiry Date (MMYY)" />
//             <TextInput style={styles.input} placeholder="CVV" />
//             <Pressable style={styles.button} onPress={handlePayment}>
//                 <Text style={styles.buttonText}>Pay</Text>
//             </Pressable>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         justifyContent: 'center',
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 12,
//         paddingHorizontal: 8,
//     },
//     button: {
//         height: 40,
//         backgroundColor: '#007BFF',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//     },
// });

// export default PaymentWebView;
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
