import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const AddOrder = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    quantity: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerRes, productRes] = await Promise.all([
          api.get('/customers'),
          api.get('/products')
        ]);
        setCustomers(customerRes.data || []);
        setProducts(productRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load options for customers or products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (name === 'productId') {
      const prod = products.find(p => p._id === value) || null;
      setSelectedProduct(prod);
      calculateTotal(prod, updatedForm.quantity);
    } else if (name === 'quantity') {
      calculateTotal(selectedProduct, value);
    }
  };

  const calculateTotal = (product, quantity) => {
    const qty = parseInt(quantity, 10);
    if (product && !isNaN(qty) && qty > 0) {
      setTotalAmount(product.price * qty);
    } else {
      setTotalAmount(0);
    }
  };

  const validate = () => {
    const { customerId, productId, quantity } = formData;
    if (!customerId) return 'Please select a customer';
    if (!productId) return 'Please select a product';
    if (!quantity) return 'Please enter quantity';

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return 'Quantity must be a positive integer';
    }

    if (selectedProduct && qty > selectedProduct.stock) {
      return `Insufficient stock. Only ${selectedProduct.stock} items available.`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      await api.post('/orders', {
        customerId: formData.customerId,
        productId: formData.productId,
        quantity: parseInt(formData.quantity, 10)
      });
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center"><p>Loading customer and product options...</p></div>;

  return (
    <div>
      <div className="header-row">
        <h1>Add New Order</h1>
        <Link to="/orders" className="btn">Back to List</Link>
      </div>

      <div className="card">
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="customerId">Customer</label>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">-- Select Customer --</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="productId">Product</label>
            <select
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">-- Select Product --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.productName} (In Stock: {p.stock})</option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="info-box">
              <p><strong>Price:</strong> Rupees.{selectedProduct.price.toFixed(2)}</p>
              <p><strong>Available Stock:</strong> {selectedProduct.stock}</p>
            </div>
          )}

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label" htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 5"
              min="1"
            />
          </div>

          <div className="info-box">
            <p style={{ fontSize: '1.05rem' }}>
              <strong>Calculated Total Amount:</strong> Rupees{totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="form-actions">
            <Link to="/orders" className="btn">Cancel</Link>
            <button 
              type="submit" 
              disabled={submitting || (selectedProduct && selectedProduct.stock === 0)} 
              className="btn btn-primary"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
