import { useState } from 'react';
import api from '../services/api';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.put('/auth/change-password', { oldPassword, newPassword });
      setMessage('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
  };

  if (!isOpen) {
    return <button className="btn btn-outline" style={{ fontSize: '12px', padding: '4px 8px' }} onClick={() => setIsOpen(true)}>Change Password</button>;
  }

  return (
    <div className="glass-panel" style={{ position: 'absolute', top: '60px', right: '20px', zIndex: 1000, width: '300px' }}>
      <h4 style={{ marginBottom: '12px' }}>Change Password</h4>
      {message && <div style={{ color: 'var(--success-color)', marginBottom: '8px', fontSize: '13px' }}>{message}</div>}
      {error && <div className="error-text" style={{ marginBottom: '8px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>Old Password</label>
          <input className="input" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label>New Password</label>
          <input className="input" type="password" placeholder="8-16 chars, 1 uppercase, 1 special" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} maxLength={16} pattern="^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$" title="Password must be 8-16 characters long, contain at least one uppercase letter and one special character." />
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button className="btn" type="submit" style={{ flex: 1, padding: '8px' }}>Update</button>
          <button className="btn btn-outline" type="button" style={{ flex: 1, padding: '8px' }} onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
