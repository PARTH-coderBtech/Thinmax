const dotenv = require('dotenv');
dotenv.config();
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY);
console.log('Razorpay Key Secret:', process.env.RAZORPAY_SECRET);
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

