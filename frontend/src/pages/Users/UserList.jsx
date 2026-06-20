import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const UserList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customers');
      setCustomers(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      try {
        await api.delete(`/customers/${id}`);
        setSuccess(`Customer "${name}" deleted successfully.`);
        setCustomers(customers.filter(c => c._id !== id));
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete customer');
        setTimeout(() => setError(''), 4000);
      }
    }
  };

  if (loading) return <div className="text-center"><p>Loading customers...</p></div>;

  return (
    <div>
      <div className="header-row">
        <h1>Customers</h1>
        <Link to="/users/add" className="btn btn-primary">
          Add Customer
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {customers.length === 0 ? (
        <div className="no-data">No customers found. Click "Add Customer" to create one.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td>
                    <div className="button-group">
                      <Link to={`/users/edit/${customer._id}`} className="btn btn-sm">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(customer._id, customer.name)} 
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

export default UserList;
