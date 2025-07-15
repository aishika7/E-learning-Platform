const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, courseId } = req.body;

    const options = {
      amount: amount, // in rupees
      currency: "INR",
      receipt: `rcpt_${courseId}_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { payment, courseId } = req.body;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(payment.razorpay_order_id + "|" + payment.razorpay_payment_id)
      .digest('hex');

    if (generated_signature === payment.razorpay_signature) {
      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
};
