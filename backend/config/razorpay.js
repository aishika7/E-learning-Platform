const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY, // to be replced by the actual key
  key_secret: process.env.RAZORPAY_SECRET, //to be replaced by actual secret key
});

module.exports = razorpay;
