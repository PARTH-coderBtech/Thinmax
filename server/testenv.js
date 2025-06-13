const dotenv = require('dotenv');
dotenv.config();
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY);
console.log('Razorpay Key Secret:', process.env.RAZORPAY_SECRET);
