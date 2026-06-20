import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          E-commerce Website
        </NavLink>
        <div className="navbar-links">
          <NavLink 
            to="/users" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Customers
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Products
          </NavLink>
          <NavLink 
            to="/orders" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Orders
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
