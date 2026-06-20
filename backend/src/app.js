const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customer.routes');
const productsRoutes = require('./routes/products.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', orderRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Inventory and Order Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
