// backend/models/CartModel.js
const mongoose = require('mongoose');

// Schema for an individual item inside the cart
const cartItemSchema = mongoose.Schema({
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    // Only storing the primary image string
    image: { type: String }, 
    qty: { type: Number, required: true, default: 1 },
});

// Main Cart Schema
const cartSchema = mongoose.Schema({
    // Fixed ID for a single mock cart (Persistence for "Guest" cart)
    mockUserId: { type: String, required: true, default: 'VibeGuestCart' }, 
    
    // Array of items in the cart
    items: [cartItemSchema],

}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Cart, cartItemSchema };