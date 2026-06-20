import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    quantity: ''
  });
  
  const [originalOrder, setOriginalOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerRes, productRes, orderRes] = await Promise.all([
          api.get('/customers'),
          api.get('/products'),
          api.get(`/orders/${id}`)
        ]);

        setCustomers(customerRes.data || []);
        const fetchedProducts = productRes.data || [];
        setProducts(fetchedProducts);

        const order = orderRes.data;
        if (order) {
          setOriginalOrder(order);
          setFormData({
            customerId: order.customerId?._id || order.customerId || '',
            productId: order.productId?._id || order.productId || '',
            quantity: order.quantity?.toString() || ''
          });
          
          const prodId = order.productId?._id || order.productId || '';
          const prod = fetchedProducts.find(p => p._id === prodId) || null;
          setSelectedProduct(prod);
          
          if (prod && order.quantity) {
            setTotalAmount(prod.price * order.quantity);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load order data or lists');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  // Calculate adjusted stock of selected product
  const getAdjustedStock = () => {
    if (!selectedProduct) return 0;
    
    // If selected product is the same as original order's product,
    // the actual available stock includes the original order's quantity.
    const isSameProduct = originalOrder && originalOrder.productId?._id === selectedProduct._id;
    if (isSameProduct) {
      return selectedProduct.stock + originalOrder.quantity;
    }
    return selectedProduct.stock;
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

    const maxStock = getAdjustedStock();
    if (qty > maxStock) {
      return `Insufficient stock. Only ${maxStock} items available (including this order's quantity).`;
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
      await api.put(`/orders/${id}`, {
        customerId: formData.customerId,
        productId: formData.productId,
        quantity: parseInt(formData.quantity, 10)
      });
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center"><p>Loading order data...</p></div>;

  const adjustedStock = getAdjustedStock();

  return (
    <div>
      <div className="header-row">
        <h1>Edit Order</h1>
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
                <option key={p._id} value={p._id}>{p.productName} (Available stock: {p.stock})</option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="info-box">
              <p><strong>Price:</strong> Rupees{selectedProduct.price.toFixed(2)}</p>
              <p><strong>Available Stock (incl. current order):</strong> {adjustedStock}</p>
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
              disabled={submitting || adjustedStock === 0} 
              className="btn btn-primary"
            >
              {submitting ? 'Saving Order...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
