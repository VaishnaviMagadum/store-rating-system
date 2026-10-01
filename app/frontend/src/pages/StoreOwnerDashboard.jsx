import { useState, useEffect } from 'react';
import api from '../services/api';
import { Star, Users, MapPin, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get('/stores/dashboard');
        setStoreData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load store data');
      }
    };
    fetchStore();
  }, []);

  if (error) return <div className="error-text" style={{ margin: '2rem', textAlign: 'center' }}>{error}</div>;
  if (!storeData) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading store dashboard...</div>;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedRatings = [...storeData.ratings].sort((a, b) => {
    let aValue = a.User[sortConfig.key];
    let bValue = b.User[sortConfig.key];
    if (sortConfig.key === 'rating') {
      aValue = a.rating;
      bValue = b.rating;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    name: `${star} Stars`,
    count: storeData.ratings.filter(r => r.rating === star).length
  }));

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <div className="hero-banner" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '3.5rem', borderRadius: '24px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>{storeData.store.name}</h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '1.1rem' }}>
              <MapPin size={18} /> {storeData.store.address}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '150px', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Average Rating</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                <Star size={28} fill="#fbbf24" />
                {storeData.averageRating > 0 ? storeData.averageRating.toFixed(1) : 'New'}
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', minWidth: '150px', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Total Ratings</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '2.5rem', fontWeight: 800, color: '#60a5fa', lineHeight: 1 }}>
                <Users size={28} color="#60a5fa" />
                {storeData.ratings.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginTop: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: 0 }}>
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            <TrendingUp size={20} color="var(--secondary)" /> Rating Distribution
          </h3>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" tick={{fill: 'var(--text-main)', fontWeight: 600}} axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ background: 'rgba(10, 10, 15, 0.85)', border: '1px solid var(--secondary)', borderRadius: '12px', backdropFilter: 'blur(10px)' }} 
                  itemStyle={{ color: 'var(--secondary)', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="url(#colorUv)" radius={[0, 6, 6, 0]} barSize={24} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '180px', height: '180px', borderRadius: '50%', background: 'conic-gradient(from 180deg at 50% 50%, var(--secondary) 0deg, var(--primary) 180deg, var(--bg-card) 360deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 0 40px rgba(0, 245, 212, 0.2)' }}>
            <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(to right, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '4px' }}>
                {storeData.averageRating > 0 ? storeData.averageRating.toFixed(1) : '0'}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>out of 5</span>
            </div>
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 800 }}>Overall Satisfaction</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Based on {storeData.ratings.length} verified customer reviews and ratings.</p>
        </div>
      </div>

      <div style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Customer Ratings Overview</h2>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Customer {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('email')}>Email Address {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('rating')} style={{ textAlign: 'right' }}>Rating {sortConfig.key === 'rating' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
              </tr>
            </thead>
            <tbody>
              {sortedRatings.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No ratings received yet. Ratings submitted by users will appear here.
                  </td>
                </tr>
              ) : (
                sortedRatings.map((r, i) => (
                  <tr key={r.id} className={`stagger-${(i % 4) + 1}`}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{r.User.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.User.email}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--bg-input)', padding: '6px 12px', borderRadius: '20px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{r.rating}</span>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" style={{ marginTop: '-2px' }} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
