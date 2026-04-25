const Paystack = require('paystack');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Job = require('../models/Job');
const { v4: uuidv4 } = require('uuid');

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// @desc    Initialize payment
// @route   POST /api/payments/initialize
// @access  Private
exports.initializePayment = async (req, res) => {
  try {
    const { amount, purpose, email, jobId } = req.body;

    if (!amount || !purpose || !email) {
      return res.status(400).json({
        success: false,
        message: 'Amount, purpose, and email are required'
      });
    }

    const reference = uuidv4();

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      amount,
      reference,
      purpose,
      metadata: {
        jobId,
        description: `Payment for ${purpose}`
      }
    });

    // Initialize Paystack transaction
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Convert to kobo/pesewas
      reference,
      currency: 'GHS',
      metadata: {
        custom_fields: [
          {
            display_name: 'Purpose',
            variable_name: 'purpose',
            value: purpose
          },
          {
            display_name: 'User ID',
            variable_name: 'user_id',
            value: req.user.id
          }
        ]
      }
    });

    res.json({
      success: true,
      data: {
        authorizationUrl: response.data.authorization_url,
        accessCode: response.data.access_code,
        reference: response.data.reference,
        paymentId: payment._id
      }
    });
  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message
    });
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify/:reference
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await paystack.transaction.verify(reference);

    if (response.data.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    const payment = await Payment.findOne({ 
      $or: [{ reference }, { paystackReference: reference }] 
    }).populate('user');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    if (payment.status === 'success') {
      return res.json({
        success: true,
        message: 'Payment already verified',
        data: { payment }
      });
    }

    // Update payment status
    payment.status = 'success';
    payment.paidAt = new Date();
    payment.verifiedAt = new Date();
    payment.paymentMethod = response.data.channel;
    payment.paystackReference = reference;
    await payment.save();

    // Update user or job based on payment purpose
    if (payment.purpose === 'mca_registration') {
      await User.findByIdAndUpdate(payment.user._id, {
        hasPaid: true,
        paymentReference: reference
      });
    } else if (payment.purpose === 'job_posting' && payment.metadata.jobId) {
      await Job.findByIdAndUpdate(payment.metadata.jobId, {
        hasPaid: true,
        paymentReference: reference,
        status: 'pending_approval'
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// @desc    Get user payments
// @route   GET /api/payments/my-payments
// @access  Private
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(20);

    res.json({
      success: true,
      count: payments.length,
      data: { payments }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Webhook handler for Paystack
// @route   POST /api/payments/webhook
// @access  Public (Paystack webhook)
exports.webhook = async (req, res) => {
  try {
    const hash = req.headers['x-paystack-signature'];
    const event = req.body;

    // Verify webhook signature (in production, use actual secret hash)
    // This is simplified for demo purposes

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      const payment = await Payment.findOne({ 
        $or: [{ reference }, { paystackReference: reference }] 
      }).populate('user');

      if (payment && payment.status !== 'success') {
        payment.status = 'success';
        payment.paidAt = new Date();
        payment.verifiedAt = new Date();
        payment.paystackReference = reference;
        await payment.save();

        // Update user or job based on payment purpose
        if (payment.purpose === 'mca_registration') {
          await User.findByIdAndUpdate(payment.user._id, {
            hasPaid: true,
            paymentReference: reference
          });
        } else if (payment.purpose === 'job_posting' && payment.metadata.jobId) {
          await Job.findByIdAndUpdate(payment.metadata.jobId, {
            hasPaid: true,
            paymentReference: reference,
            status: 'pending_approval'
          });
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
};
