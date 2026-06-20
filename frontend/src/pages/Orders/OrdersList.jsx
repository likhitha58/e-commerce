import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? Deleting will revert the product inventory stock.')) {
      try {
        await api.delete(`/orders/${id}`);
        setSuccess('Order deleted and stock reverted successfully.');
        setOrders(orders.filter(o => o._id !== id));
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete order');
        setTimeout(() => setError(''), 4000);
      }
    }
  };

  if (loading) return <div className="text-center"><p>Loading orders...</p></div>;

  return (
    <div>
      <div className="header-row">
        <h1>Orders</h1>
        <Link to="/orders/add" className="btn btn-primary">
          Add Order
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {orders.length === 0 ? (
        <div className="no-data">No orders found. Click "Add Order" to create one.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customerId?.name || <span style={{color: 'red'}}>Deleted Customer</span>}</td>
                  <td>{order.productId?.productName || <span style={{color: 'red'}}>Deleted Product</span>}</td>
                  <td>{order.quantity}</td>
                  <td>Rupees{order.totalAmount?.toFixed(2)}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <div className="button-group">
                      <Link to={`/orders/edit/${order._id}`} className="btn btn-sm">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(order._id)} 
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
