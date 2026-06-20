import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        setSuccess(`Product "${name}" deleted successfully.`);
        setProducts(products.filter(p => p._id !== id));
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete product');
        setTimeout(() => setError(''), 4000);
      }
    }
  };

  if (loading) return <div className="text-center"><p>Loading products...</p></div>;

  return (
    <div>
      <div className="header-row">
        <h1>Products</h1>
        <Link to="/products/add" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {products.length === 0 ? (
        <div className="no-data">No products found. Click "Add Product" to add items to stock.</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>Rupees{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="button-group">
                      <Link to={`/products/edit/${product._id}`} className="btn btn-sm">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id, product.productName)} 
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

export default ProductsList;
