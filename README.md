# MERN E-Commerce Management System

A simple MERN (MongoDB, Express.js, React, Node.js) application for managing customers, products, and orders.

## Features

### Customers
- Add Customer
- View Customer List
- Edit Customer
- Delete Customer

### Products
- Add Product
- View Product List
- Edit Product
- Delete Product

### Orders
- Add Order
- View Orders
- Edit Orders
- Delete Orders
- Customer and Product selection using dropdowns
- Automatic total amount calculation

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- CSS / Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
SESSION2
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/likhitha58/e-commerce.git
cd e-commerce
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start backend:

```bash
npm start
```

or

```bash
nodemon server.js
```

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

## API Endpoints

### Customers

```http
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```http
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

## Author

**Likhitha Tanuboddi**

CSE (AIML) | MERN Stack Developer