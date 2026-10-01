import { useState, useEffect } from 'react';
import api from '../services/api';
import AddUserForm from '../components/AddUserForm';
import AddStoreForm from '../components/AddStoreForm';
import { Search, Users, Store, Star, Filter, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchStats = async () => {
    const res = await api.get('/admin/dashboard');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    setLoading(true);
    let url = `/admin/users?search=${search}&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}`;
    if (roleFilter) url += `&role=${roleFilter}`;
    const res = await api.get(url);
    setUsers(res.data);
    setLoading(false);
  };

  const fetchStores = async () => {
    setLoading(true);
    const res = await api.get(`/admin/stores?search=${search}&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}`);
    setStores(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'stores') fetchStores();
  }, [activeTab, search, roleFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleViewUser = async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    setSelectedUser(res.data);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your platform, users, and stores efficiently.</p>
        </div>
        <div className="tabs" style={{ marginBottom: 0, border: 'none', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', margin: 0 }} onClick={() => setActiveTab('dashboard')}>Dashboard</div>
          <div className={`tab ${activeTab === 'users' ? 'active' : ''}`} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', margin: 0 }} onClick={() => setActiveTab('users')}>Users</div>
          <div className={`tab ${activeTab === 'stores' ? 'active' : ''}`} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', margin: 0 }} onClick={() => setActiveTab('stores')}>Stores</div>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="grid-3">
            <div className="glass-panel hover-float" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={32} color="#3b82f6" />
              </div>
              <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Users</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{stats.totalUsers}</div>
              </div>
            </div>
            <div className="glass-panel hover-float" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={32} color="#d946ef" />
              </div>
              <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Stores</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{stats.totalStores}</div>
              </div>
            </div>
            <div className="glass-panel hover-float" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={32} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Ratings</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{stats.totalRatings}</div>
              </div>
            </div>
          </div>
          
          <div className="hero-banner" style={{ background: 'var(--primary)', color: 'white', marginTop: '1rem', padding: '3rem', borderRadius: '24px' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Welcome to the Control Center</h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>You have full access to manage the entire platform. Navigate to the Users or Stores tabs above to add new records or moderate existing ones.</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
              <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input className="input" style={{ paddingLeft: '48px', width: '100%', padding: '12px 12px 12px 48px' }} placeholder="Search users by name, email, or address..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Filter size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                <select className="input" style={{ width: '220px', paddingLeft: '44px', padding: '12px 12px 12px 44px' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="NORMAL_USER">Normal User</option>
                  <option value="SYSTEM_ADMIN">System Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>
              <button className="btn" onClick={() => setShowAddUser(!showAddUser)} style={{ padding: '12px 24px' }}>
                {showAddUser ? 'Cancel' : <><Plus size={18} /> Add User</>}
              </button>
            </div>
          </div>

          {showAddUser && (
            <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
              <AddUserForm onSuccess={() => { fetchUsers(); setShowAddUser(false); }} />
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('role')}>Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th>Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>Loading users...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No users found matching criteria.</td></tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={u.id} className={`stagger-${(i % 4) + 1}`}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${
                          u.role === 'SYSTEM_ADMIN' ? 'badge-admin' : 
                          u.role === 'STORE_OWNER' ? 'badge-owner' : 'badge-user'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                      <td style={{ textAlign: 'right' }}><button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => handleViewUser(u.id)}>View Details</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {selectedUser && (
            <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', border: '2px solid var(--primary)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '2px' }}>{selectedUser.name}</h3>
                    <span className="badge badge-user">{selectedUser.role.replace('_', ' ')}</span>
                  </div>
                </div>
                <button className="btn btn-outline" onClick={() => setSelectedUser(null)}>Close</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--bg-input)', borderRadius: '12px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Email Address</p>
                  <p style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: '1rem' }}>{selectedUser.email}</p>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Physical Address</p>
                  <p style={{ fontWeight: 500 }}>{selectedUser.address}</p>
                </div>
                
                {selectedUser.store ? (
                  <div style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Store size={18}/> Assigned Store</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Store Name</p>
                    <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>{selectedUser.store.name}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Location</p>
                        <p style={{ fontWeight: 500 }}>{selectedUser.store.address}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Rating</p>
                        <p style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.2rem' }}>★ {selectedUser.store.averageRating > 0 ? selectedUser.store.averageRating.toFixed(1) : 'New'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                    No store assigned to this user.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'stores' && (
        <>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input className="input" style={{ paddingLeft: '48px', width: '100%', padding: '12px 12px 12px 48px' }} placeholder="Search stores by name, email, or address..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn" onClick={() => setShowAddStore(!showAddStore)} style={{ padding: '12px 24px' }}>
              {showAddStore ? 'Cancel' : <><Plus size={18} /> Add Store</>}
            </button>
          </div>

          {showAddStore && (
            <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
              <AddStoreForm onSuccess={() => { fetchStores(); setShowAddStore(false); }} />
            </div>
          )}
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Store Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th>Address</th>
                  <th style={{ textAlign: 'right' }}>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>Loading stores...</td></tr>
                ) : stores.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No stores found matching criteria.</td></tr>
                ) : (
                  stores.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.name}</td>
                      <td>{s.email}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.address}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', padding: '4px 10px', borderRadius: '20px' }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" /> 
                          <span style={{ fontWeight: 700, color: '#92400e' }}>{s.averageRating > 0 ? s.averageRating.toFixed(1) : 'New'}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
