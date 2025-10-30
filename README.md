# 🛍️ Vibe Commerce: MERN Stack E-Commerce Shopping Cart

This project is a full-stack e-commerce shopping cart application built using the **MERN (MongoDB, Express, React, Node.js) stack**. It demonstrates key full-stack concepts, including API integration, RESTful API design, database modeling, and state management.

## ✨ Features

* **Dynamic Product Catalog:** Products are fetched from an **external third-party API** and automatically seeded into the MongoDB database upon first load.
* **Persistent Shopping Cart:** Cart items, quantities, and totals are stored in **MongoDB** via a custom backend API.
* **Full Cart Functionality:** Add/Remove items, update item quantities, and automatically calculate subtotal, tax (8%), and final total.
* **Mock Checkout Process:** Simulates a checkout flow, validates customer details, clears the cart upon success, and returns a detailed mock receipt.
* **Secure Setup:** Environment variables (`.env`) for the MongoDB URI are securely ignored via `.gitignore`.

---

## 🏗️ Architecture & Data Flow

This application features a clear separation of concerns between the frontend (React) and the backend (Node/Express).

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React, Axios | Displays products, manages navigation, and interacts with the `/api` routes. |
| **Backend API** | Node.js, Express | Defines RESTful endpoints for Cart and Product management. |
| **Product Data** | **Third-Party API Integration** | Source of all product names, prices, and images (Read-Only). |
| **Cart Data** | MongoDB, Mongoose | Stores user's persistent cart items (Read/Write). |

---

## 🛠️ Setup and Installation

Follow these steps to get the project up and running locally.

### 1. Prerequisites

* Node.js (v14+)
* MongoDB (Local instance or Cloud Atlas cluster)

### 2. Backend Setup

1.  Navigate into the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Create a file named **`.env`** in the `backend` directory and add your MongoDB connection string:
    ```
    # .env file content
    MONGO_URI="YOUR_MONGODB_CONNECTION_STRING_HERE"
    PORT=5000
    ```
4.  Start the backend server:
    ```bash
    npm start
    # Server running on port 5000 🚀
    # MongoDB Connected Successfully! 💾
    ```

### 3. Frontend Setup

1.  Open a **new terminal window** and navigate into the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the React application:
    ```bash
    npm start
    ```

The application will automatically open in your browser (usually at `http://localhost:3000`).

---

## 📸 Screenshots & Demonstration

The following screenshots illustrate the core features of the application.

### 1. Product Catalog View

The product list is displayed, with data seeded from the external API into the MongoDB database. Users can click the "**Add to Cart**" button to begin shopping.

[**Image 1: Product Catalog View** - *Screenshot of the product grid with 'Add to Cart' buttons.*]

### 2. Shopping Cart Summary

This view shows the persistent cart items fetched from the backend, along with dynamic calculations for the subtotal, tax, and final total.

[**Image 2: Shopping Cart Summary** - *Screenshot of the cart table showing items, quantity inputs, 'Remove' button, and the final Cart Summary box.*]

### 3. Checkout Confirmation

The final screen demonstrates the mock checkout process, where customer details are captured, and a final receipt is returned after the cart is successfully cleared in the database.

[**Image 3: Checkout Confirmation** - *Screenshot of the successful 'Order Placed Successfully!' receipt.*]

---

## 🔑 Key Backend Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieves all products (seeds DB if empty). |
| `GET` | `/api/cart` | Retrieves the current cart contents and calculates totals. |
| `POST` | `/api/cart` | Adds a new item or increments the quantity of an existing item. |
| `PUT` | `/api/cart` | Sets a specific item to a new quantity. |
| `DELETE` | `/api/cart/:id` | Removes a specific item from the cart. |
| `POST` | `/api/checkout` | Processes the mock order, calculates final totals, and **clears the cart** in the database. |
