import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      {/* Right side - Image */}
      <div className="hidden-mobile" style={{ flex: '1', position: 'relative' }}>
        <img 
          src="/signup_bg.jpg" 
          alt="Modern Abstract Background" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopRightRadius: '2rem', borderBottomRightRadius: '2rem', boxShadow: '10px 0 30px rgba(0,0,0,0.5)', transform: 'scaleX(-1)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(3,0,20,1) 0%, rgba(3,0,20,0) 25%)' }} />
      </div>

      {/* Left side - Form */}
      <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', padding: '3rem', justifyContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>Create Account</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Join the community and start rating your favorite stores.</p>
          </div>
          
          {error && <div className="error-text" style={{ marginBottom: '1.5rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input className="input" type="text" placeholder="John Doe (min 20 chars)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required minLength={20} maxLength={60} style={{ padding: '0.875rem 1rem', fontSize: '1rem' }} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Email Address</label>
              <input className="input" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '0.875rem 1rem', fontSize: '1rem' }} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <input className="input" type="password" placeholder="8-16 chars, 1 uppercase, 1 special" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={8} maxLength={16} pattern="^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$" title="Password must be 8-16 characters long, contain at least one uppercase letter and one special character." style={{ padding: '0.875rem 1rem', fontSize: '1rem' }} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Address</label>
              <textarea className="input" rows="3" placeholder="Your full address..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} maxLength={400} style={{ padding: '0.875rem 1rem', fontSize: '1rem', resize: 'vertical' }} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '10px' }}>Sign Up</button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 600, color: 'var(--secondary)', marginLeft: '0.5rem' }}>Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
