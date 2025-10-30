// frontend/src/components/CheckoutScreen.js
import React, { useState } from 'react';
import axios from 'axios';

const CheckoutScreen = ({ onNavigate, cartData, setTotalItems }) => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // POST request to /api/checkout
            const { data } = await axios.post('/api/checkout', formData);
            
            setReceipt(data);
            setTotalItems(0); // Clear the cart count

        } catch (err) {
            console.error('Checkout failed:', err.response ? err.response.data : err);
            setError(err.response?.data?.message || 'Checkout failed due to a server error.');
        } finally {
            setLoading(false);
        }
    };
    
    // --- Render Receipt Modal ---
    if (receipt) {
        return (
            <div className="receipt-modal">
                <h2>✅ Order Placed Successfully!</h2>
                <p>Order ID: **{receipt.orderId}**</p>
                <p>Date: **{new Date(receipt.timestamp).toLocaleString()}**</p>
                
                <h3>Customer: {receipt.customerName}</h3>

                <h3>Order Summary:</h3>
                <p>Items Count: {receipt.itemsCount}</p>
                <p>Subtotal: ${receipt.subtotal}</p>
                <p>Tax: ${receipt.tax}</p>
                <h3 style={{ color: 'green' }}>Total Paid: ${receipt.total}</h3>

                <button onClick={() => { setReceipt(null); onNavigate('products'); }}>
                    Continue Shopping
                </button>
            </div>
        );
    }
    // ----------------------------------------

    if (cartData.items.length === 0 || cartData.total === 0) {
         return (
            <div className="cart-empty">
                <h2>Your Cart is Empty!</h2>
                <p>You cannot checkout with an empty cart.</p>
                <button onClick={() => onNavigate('products')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="checkout-view">
            <h2>Checkout Details</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="order-summary-box">
                    <h3>Final Order Totals</h3>
                    <p>Subtotal: **${cartData.subtotal}**</p>
                    <p>Tax: **${cartData.tax}**</p>
                    <p className="final-total">Total: **${cartData.total}**</p>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : `Place Order (Total: $${cartData.total})`}
                </button>
            </form>
        </div>
    );
};

export default CheckoutScreen;