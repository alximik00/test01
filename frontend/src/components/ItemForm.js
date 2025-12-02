import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createItem, updateItem } from '../store/itemsSlice';

const ItemForm = ({ item, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setDescription(item.description || '');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (item) {
        await dispatch(updateItem({ id: item.id, name, description })).unwrap();
      } else {
        await dispatch(createItem({ name, description })).unwrap();
      }
      onSuccess();
    } catch (err) {
      setError(Array.isArray(err) ? err.join(', ') : err);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>{item ? 'Edit Item' : 'Create Item'}</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.textarea}
              rows="4"
            />
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.submitButton}>
              {item ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.25rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.25rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    flex: 1,
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    flex: 1,
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: '#ffe6e6',
    borderRadius: '4px',
  },
};

export default ItemForm;

