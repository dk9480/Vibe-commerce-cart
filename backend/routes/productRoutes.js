// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Product = require('../models/ProductModel');

const EXTERNAL_PRODUCTS_API = 'https://api.escuelajs.co/api/v1/products'; 

// Helper function to map external data to our schema
const mapExternalProduct = (externalProduct) => {
    return {
        id: externalProduct.id, 
        name: externalProduct.title,
        price: externalProduct.price,
        description: externalProduct.description,
        // Ensure image URLs are valid strings before inserting
        images: externalProduct.images.filter(img => typeof img === 'string' && img.startsWith('http')), 
        category: {
            id: externalProduct.category?.id,
            name: externalProduct.category?.name
        }
    };
};

// @desc    Fetch all products from DB, or seed if DB is empty
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        let products = await Product.find({});
        
        if (products.length === 0) {
            console.log('Database is empty. Attempting to seed from external API...');

            // Fetch data from external API (limiting to 20 products)
            const { data: externalData } = await axios.get(`${EXTERNAL_PRODUCTS_API}?offset=0&limit=20`);

            const mappedProducts = externalData
                .filter(p => p.title && p.price) 
                .map(mapExternalProduct);

            // Insert mapped products into MongoDB
            await Product.insertMany(mappedProducts);

            products = await Product.find({});
            console.log(`Successfully seeded ${products.length} products.`);
        }

        res.json(products);

    } catch (error) {
        console.error("Error fetching or seeding products:", error);
        res.status(500).json({ message: 'Server Error fetching product data.' });
    }
});

module.exports = router;