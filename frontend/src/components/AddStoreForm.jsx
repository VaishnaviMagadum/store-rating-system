import { useState } from 'react';
import api from '../services/api';

const AddStoreForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', formData);
      onSuccess();
      setFormData({ name: '', email: '', address: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add store');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Add New Store</h3>
      {error && <div className="error-text" style={{ marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
        <div className="input-group">
          <label>Store Name</label>
          <input className="input" placeholder="Store Name (20-60 chars)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required minLength={20} maxLength={60} />
        </div>
        <div className="input-group">
          <label>Store Email</label>
          <input className="input" type="email" placeholder="Store Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label>Address</label>
          <input className="input" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} maxLength={400} />
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button className="btn" type="submit">Add Store</button>
        </div>
      </form>
    </div>
  );
};

export default AddStoreForm;
