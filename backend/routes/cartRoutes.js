// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { Cart } = require('../models/CartModel');
const Product = require('../models/ProductModel'); 

const MOCK_USER_ID = 'VibeGuestCart';
const TAX_RATE = 0.08; 

// --- Helper Function to Calculate Totals ---
const calculateCartTotals = (cart) => {
    let subtotal = 0;
    
    if (cart && cart.items.length > 0) {
        subtotal = cart.items.reduce((acc, item) => 
            acc + (item.price * item.qty), 0
        );
    }

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return {
        items: cart ? cart.items : [],
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
    };
};

// @desc    Get the current user's cart and calculate totals
// @route   GET /api/cart
// @access  Public
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne({ mockUserId: MOCK_USER_ID });
        const cartData = calculateCartTotals(cart);
        res.json(cartData);
    } catch (error) {
        console.error("Cart fetch error:", error);
        res.status(500).json({ message: 'Server Error fetching cart data.' });
    }
});

// @desc    Add (if new) or Increment (if exists) item in cart
// @route   POST /api/cart
// @access  Public
router.post('/', async (req, res) => {
    const { productId, qty } = req.body; 

    if (!productId || !qty || qty <= 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity.' });
    }

    try {
        const product = await Product.findOne({ id: productId });
        if (!product) { return res.status(404).json({ message: 'Product not found.' }); }

        let cart = await Cart.findOne({ mockUserId: MOCK_USER_ID });
        if (!cart) { cart = new Cart({ mockUserId: MOCK_USER_ID, items: [] }); }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            // Item exists: INCREMENT quantity
            cart.items[itemIndex].qty += qty;
        } else {
            // Item is new: Add to cart
            const newItem = {
                productId: product.id,
                name: product.name,
                price: product.price,
                // Use the first image from the dynamic data
                image: product.images && product.images.length > 0 ? product.images[0] : '', 
                qty: qty 
            };
            cart.items.push(newItem);
        }
        
        await cart.save();
        const cartData = calculateCartTotals(cart);
        res.status(200).json(cartData);

    } catch (error) {
        console.error("Cart POST error:", error);
        res.status(500).json({ message: 'Server Error adding item to cart.' });
    }
});

// @desc    Update/Set the quantity of an existing item in cart
// @route   PUT /api/cart
// @access  Public
router.put('/', async (req, res) => {
    const { productId, qty } = req.body;

    if (!productId || qty === undefined || qty < 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity.' });
    }

    try {
        let cart = await Cart.findOne({ mockUserId: MOCK_USER_ID });
        if (!cart) { return res.status(404).json({ message: 'Cart not found.' }); }
        
        const itemIndex = cart.items.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            if (qty === 0) {
                 // If quantity is 0, remove the item
                 cart.items = cart.items.filter(item => item.productId !== productId);
            } else {
                 // Set the item to the new quantity
                 cart.items[itemIndex].qty = qty;
            }
        } else {
            return res.status(404).json({ message: 'Product not found in cart for update.' });
        }

        await cart.save();
        const cartData = calculateCartTotals(cart);
        res.status(200).json(cartData);

    } catch (error) {
        console.error("Cart PUT update error:", error);
        res.status(500).json({ message: 'Server Error updating item quantity.' });
    }
});


// @desc    Remove an item from the cart
// @route   DELETE /api/cart/:productId
// @access  Public
router.delete('/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) { return res.status(400).json({ message: 'Invalid Product ID provided.' }); }

    try {
        let cart = await Cart.findOne({ mockUserId: MOCK_USER_ID });
        if (!cart) { return res.status(404).json({ message: 'Cart not found.' }); }
        
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.productId !== productId);

        if (cart.items.length === initialItemCount) {
             return res.status(404).json({ message: 'Item not found in cart.' });
        }

        await cart.save();
        const cartData = calculateCartTotals(cart);
        res.status(200).json(cartData);

    } catch (error) {
        console.error("Cart deletion error:", error);
        res.status(500).json({ message: 'Server Error removing item from cart.' });
    }
});

// Export both the router and the helper function for checkoutRoutes
module.exports = { router, calculateCartTotals };