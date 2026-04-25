const express = require('express');
const router = express.Router();
const { 
  initializePayment, 
  verifyPayment, 
  getMyPayments, 
  webhook 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Public route (webhook)
router.post('/webhook', webhook);

// Protected routes
router.use(protect);

router.post('/initialize', initializePayment);
router.get('/verify/:reference', verifyPayment);
router.get('/my-payments', getMyPayments);

module.exports = router;
