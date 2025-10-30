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

[**Image 1: Product Catalog View** - *<img width="1913" height="888" alt="image" src="https://github.com/user-attachments/assets/30a2840d-a188-4cfd-83a6-58aba661b568" />
*]

### 2. Shopping Cart Summary

This view shows the persistent cart items fetched from the backend, along with dynamic calculations for the subtotal, tax, and final total.

[**Image 2: Shopping Cart Summary** - *<img width="1910" height="868" alt="image" src="https://github.com/user-attachments/assets/28ec2981-abe1-4f41-949b-920f50d06464" />
*]

### 3. Shopping Cart with Quantity Update

This view shows the persistent cart items fetched from the backend. Users can **adjust item quantities directly** using the input fields, and the subtotal, tax, and final total will update dynamically.

[**Image 2: Shopping Cart with Quantity Update** - *<img width="1919" height="822" alt="image" src="https://github.com/user-attachments/assets/e3ab81ac-85fd-4d1c-a22d-c0b592bacb12" />
*]

### 4. Checkout Process

Users proceed to the checkout screen to enter mock customer details and review the final calculated totals before placing the order.

[**Image 3: Checkout Details** - *<img width="1919" height="855" alt="image" src="https://github.com/user-attachments/assets/ae6b7222-3897-4fa9-932c-11689be68749" />
*]

### 5. Checkout Confirmation

The successful **mock checkout process** returns a final receipt, confirms the payment total, and clears the cart in the database.

[**Image 4: Order Confirmation** - *<img width="1919" height="852" alt="image" src="https://github.com/user-attachments/assets/0ade3689-b40b-4209-a2f8-600b66999ba8" />
*]

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
