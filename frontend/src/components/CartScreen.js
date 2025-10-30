// frontend/src/components/CartScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartScreen = ({ onNavigate, setTotalItems }) => {
    const [cartData, setCartData] = useState({ items: [], subtotal: 0, tax: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FIX APPLIED: fetchCart function is now defined inside useEffect
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await axios.get('/api/cart');
                setCartData(data);
                setLoading(false);
                const itemCount = data.items.reduce((acc, item) => acc + item.qty, 0);
                setTotalItems(itemCount); 
                return data;
            } catch (err) {
                setError('Failed to fetch cart data.');
                setLoading(false);
            }
        };
        
        fetchCart();
    }, [setTotalItems]); // setTotalItems is a prop, added for exhaustive-deps rule

    const handleRemoveItem = async (productId) => {
        try {
            const { data } = await axios.delete(`/api/cart/${productId}`);
            setCartData(data);
            const itemCount = data.items.reduce((acc, item) => acc + item.qty, 0);
            setTotalItems(itemCount);
        } catch (err) {
            setError(`Failed to remove item.`);
        }
    };
    
    const handleUpdateQty = async (productId, newQty) => {
        const finalQty = parseInt(newQty);
        if (isNaN(finalQty) || finalQty < 0) return;
        
        if (finalQty === 0) {
            handleRemoveItem(productId);
            return;
        }

        try {
            // Optimistic update
            setCartData(prevData => {
                const newItems = prevData.items.map(item => 
                    item.productId === productId ? { ...item, qty: finalQty } : item
                );
                return { ...prevData, items: newItems };
            });

            const { data } = await axios.put('/api/cart', {
                productId: productId,
                qty: finalQty,
            });
            
            // Final update with server-calculated totals
            setCartData(data); 
            const itemCount = data.items.reduce((acc, item) => acc + item.qty, 0);
            setTotalItems(itemCount);

        } catch (err) {
            setError(`Failed to update quantity. Reverting to previous state.`);
            // A simple re-fetch to revert to the correct state if the update failed
            try {
                 const { data } = await axios.get('/api/cart');
                 setCartData(data);
            } catch (revertErr) {
                console.error("Failed to revert cart state:", revertErr);
            }
        }
    };

    const handleProceedToCheckout = () => {
        onNavigate('checkout', cartData); 
    };

    if (loading) return <div className="cart-loading">Loading Cart...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    if (cartData.items.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your Cart is Empty</h2>
                <button onClick={() => onNavigate('products')}>🛒 Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-view">
            <h2>Shopping Cart</h2>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartData.items.map(item => (
                        <tr key={item.productId}>
                            <td>
                                {item.image && <img src={item.image} alt={item.name} className="cart-item-image"/>}
                            </td>
                            <td>{item.name}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>
                                <input 
                                    type="number" 
                                    min="0" 
                                    value={item.qty} 
                                    onChange={(e) => handleUpdateQty(item.productId, parseInt(e.target.value))}
                                    style={{ width: '60px' }}
                                />
                            </td>
                            <td>${(item.price * item.qty).toFixed(2)}</td>
                            <td>
                                <button className="remove-btn" onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cart-summary">
                <h3>Cart Summary</h3>
                <p>Subtotal: **${cartData.subtotal.toFixed(2)}**</p>
                <p>Tax (8%): **${cartData.tax.toFixed(2)}**</p>
                <p className="cart-total">Total: **${cartData.total.toFixed(2)}**</p>
                <button 
                    className="checkout-btn" 
                    onClick={handleProceedToCheckout}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartScreen;