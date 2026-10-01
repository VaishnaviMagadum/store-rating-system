import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('NORMAL_USER');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password, role });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg-main)' }}>
      {/* Left side - Form */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '4rem', justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '2rem', color: 'white', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
              S
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Enter your details to access your dashboard.</p>
          </div>
          
          {error && <div className="error-text" style={{ marginBottom: '1.5rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Account Type</label>
              <select className="input" value={role} onChange={e => setRole(e.target.value)} required style={{ padding: '1rem', fontSize: '1rem' }}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="SYSTEM_ADMIN">System Administrator</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Email Address</label>
              <input className="input" type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '1rem', fontSize: '1rem' }} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '1rem', fontSize: '1rem' }} />
            </div>
            <button className="btn" type="submit" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '10px' }}>Sign In</button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/signup" style={{ fontWeight: 600, color: 'var(--secondary)', marginLeft: '0.5rem' }}>Create an account</Link>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden-mobile" style={{ flex: '1', position: 'relative' }}>
        <img 
          src="/saas_bg.jpg" 
          alt="Modern Abstract Background" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: '2rem', borderBottomLeftRadius: '2rem', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(248,250,252,1) 0%, rgba(248,250,252,0) 15%)' }} />
      </div>
    </div>
  );
};

export default Login;
