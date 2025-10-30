// backend/models/ProductModel.js
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    // Unique ID from the external API (or manual seed)
    id: { type: Number, required: true, unique: true }, 
    
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }, 
    // Array of image URLs from the external API
    images: [{ type: String }], 
    category: {
        id: { type: Number },
        name: { type: String }
    },

}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;