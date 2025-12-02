import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchItems, deleteItem } from '../store/itemsSlice';
import { logout } from '../store/authSlice';
import ItemForm from './ItemForm';

const ItemsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.auth);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(id));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading && items.length === 0) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Items</h1>
        <div style={styles.headerActions}>
          <span style={styles.userEmail}>Welcome, {user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button onClick={() => setShowForm(true)} style={styles.addButton}>
        Add New Item
      </button>

      {showForm && (
        <ItemForm
          item={editingItem}
          onClose={handleFormClose}
          onSuccess={() => {
            handleFormClose();
            dispatch(fetchItems());
          }}
        />
      )}

      <div style={styles.itemsGrid}>
        {items.map((item) => (
          <div key={item.id} style={styles.itemCard}>
            <h3 style={styles.itemName}>{item.name}</h3>
            <p style={styles.itemDescription}>{item.description}</p>
            <div style={styles.itemActions}>
              <button onClick={() => handleEdit(item)} style={styles.editButton}>
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)} style={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div style={styles.empty}>No items yet. Create your first item!</div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userEmail: {
    color: '#666',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  itemCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  itemName: {
    marginTop: 0,
    marginBottom: '0.5rem',
    color: '#333',
  },
  itemDescription: {
    color: '#666',
    marginBottom: '1rem',
    minHeight: '3rem',
  },
  itemActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1,
  },
  error: {
    color: 'red',
    padding: '1rem',
    backgroundColor: '#ffe6e6',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    fontSize: '1.1rem',
  },
};

export default ItemsList;

