// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartScreen from './components/CartScreen'; 
import CheckoutScreen from './components/CheckoutScreen'; 
import './App.css'; 

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('products'); 
  const [totalItems, setTotalItems] = useState(0); 
  const [currentCartData, setCurrentCartData] = useState({ items: [], subtotal: 0, tax: 0, total: 0 });

  // Helper function to handle navigation and save state
  const handleNavigation = (page, data = null) => {
    if (page === 'checkout') {
        setCurrentCartData(data);
    }
    setCurrentPage(page);
  };

  // Fetch product list on load
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError('Failed to fetch products from server.');
            setLoading(false);
        }
    };
    fetchProducts();
  }, []);

  // --- HANDLER FUNCTION: Add to Cart (POST /api/cart to Increment) ---
  const handleAddToCart = async (productId) => {
    setMessage('');
    try {
      // POST request to increment by 1
      const response = await axios.post('/api/cart', { productId: productId, qty: 1 });
      
      setMessage(`Successfully added product ID ${productId} to cart!`);
      const itemCount = response.data.items.reduce((acc, item) => acc + item.qty, 0);
      setTotalItems(itemCount);

    } catch (err) {
      console.error('Error adding to cart:', err);
      setMessage(err.response?.data?.message || 'Error adding item to cart.');
    }
    setTimeout(() => setMessage(''), 3000); 
  };
  
  const renderPage = () => {
    if (currentPage === 'products') {
      return (
        <>
          <h2>Product Catalog</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {/* Display dynamic image */}
                {product.images && product.images.length > 0 && (
                    <img 
                        src={product.images[0]}
                        alt={product.name} 
                        className="product-image"
                    />
                )}
                <h3>{product.name}</h3>
                <p>{product.description ? product.description.substring(0, 50) + '...' : ''}</p>
                <p>**Price:** ${product.price.toFixed(2)}</p>
                <button 
                    className="add-btn" 
                    onClick={() => handleAddToCart(product.id)}
                >
                    Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      );
    } else if (currentPage === 'cart') {
      return <CartScreen onNavigate={handleNavigation} setTotalItems={setTotalItems} />;
    } else if (currentPage === 'checkout') {
        return <CheckoutScreen 
                    onNavigate={handleNavigation} 
                    cartData={currentCartData}
                    setTotalItems={setTotalItems}
               />;
    }
    return <h1>404 Page Not Found</h1>;
  };

  if (loading) return <h1>Loading Products...</h1>;
  if (error) return <h1 style={{ color: 'red' }}>Error: {error}</h1>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vibe Commerce</h1>
        <div className="nav-buttons">
            <button onClick={() => handleNavigation('products')}>Products</button>
            <button className="cart-nav" onClick={() => handleNavigation('cart')}>
                🛒 View Cart ({totalItems})
            </button>
        </div>
      </header>

      {message && <div className="message-bar">{message}</div>}

      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;