import { Link } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import { LogOut, User, Store, LayoutDashboard } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand animate-float">
        <Store size={28} color="var(--primary)" />
        StoreRater
      </div>
      
      <div className="sidebar-user">
        <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Logged in as</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 800 }}>
          <User size={18} color="var(--primary)" />
          {user.name}
        </div>
        <div style={{ marginTop: '8px' }}>
          <span className="badge">{user.role.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-link active">
          <LayoutDashboard size={20} />
          Dashboard
        </div>
      </div>

      <div className="sidebar-footer">
        <ChangePassword />
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }} onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
