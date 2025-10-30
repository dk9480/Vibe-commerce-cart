// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecom_cart_mock';

// --- Import Routes ---
const productRoutes = require('./routes/productRoutes');
const cartExports = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

// Extract the router object from the cartRoutes file
const cartRoutes = cartExports.router; 

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected Successfully! 💾');
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

connectDB();

// --- Express App Setup ---
const app = express();

// Middleware
app.use(cors()); // Allows frontend to access backend
app.use(express.json()); // Allows parsing of request body (JSON)

// Simple root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- API Routes ---
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));