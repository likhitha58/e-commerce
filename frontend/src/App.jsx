import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Customers (Users)
import UserList from './pages/Users/UserList';
import AddUser from './pages/Users/AddUser';
import EditUser from './pages/Users/EditUser';

// Products
import ProductsList from './pages/Products/ProductsList';
import AddProduct from './pages/Products/AddProduct';
import EditProduct from './pages/Products/EditProduct';

// Orders
import OrdersList from './pages/Orders/OrdersList';
import AddOrder from './pages/Orders/AddOrder';
import EditOrder from './pages/Orders/EditOrder';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default redirect to Customers */}
          <Route index element={<Navigate to="/users" replace />} />
          
          {/* Customers */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />

          {/* Products */}
          <Route path="products" element={<ProductsList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />

          {/* Orders */}
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/add" element={<AddOrder />} />
          <Route path="orders/edit/:id" element={<EditOrder />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
