// backend/routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const { Cart } = require('../models/CartModel');
// Import the helper function from cartRoutes
const { calculateCartTotals } = require('./cartRoutes'); 

const MOCK_USER_ID = 'VibeGuestCart'; 

// @desc    Process mock checkout
// @route   POST /api/checkout
// @access  Public
router.post('/', async (req, res) => {
    const { name, email } = req.body; 

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required for mock checkout.' });
    }

    try {
        const cart = await Cart.findOne({ mockUserId: MOCK_USER_ID });
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot checkout an empty cart.' });
        }

        const finalOrderDetails = calculateCartTotals(cart);

        // Clear the cart (The "transaction")
        cart.items = []; 
        await cart.save(); 

        // Construct the mock receipt
        const mockReceipt = {
            orderId: `VIBE-${Date.now()}`,
            customerName: name,
            customerEmail: email,
            itemsCount: finalOrderDetails.items.length,
            ...finalOrderDetails, 
            timestamp: new Date().toISOString(),
            message: 'Mock Checkout Successful! Your receipt is below.',
        };

        res.status(200).json(mockReceipt);

    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ message: 'Server Error during checkout process.' });
    }
});

module.exports = router;