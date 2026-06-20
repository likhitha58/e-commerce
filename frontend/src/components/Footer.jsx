import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} E-commerce Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
