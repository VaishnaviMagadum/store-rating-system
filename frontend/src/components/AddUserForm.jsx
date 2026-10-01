import { useState } from 'react';
import api from '../services/api';

const AddUserForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      onSuccess();
      setFormData({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add user');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>Add New User</h3>
      {error && <div className="error-text" style={{ marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
        <div className="input-group">
          <label>Name</label>
          <input className="input" placeholder="Name (min 20 chars)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required minLength={20} maxLength={60} />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input className="input" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input className="input" type="password" placeholder="8-16 chars, 1 uppercase, 1 special" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={8} maxLength={16} pattern="^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$" title="Password must be 8-16 characters long, contain at least one uppercase letter and one special character." />
        </div>
        <div className="input-group">
          <label>Address</label>
          <input className="input" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} maxLength={400} />
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label>Role</label>
          <select className="input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="NORMAL_USER">Normal User</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <button className="btn" type="submit">Add User</button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
