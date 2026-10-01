import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, SortAsc, MapPin, Star } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/stores?search=${search}&sortBy=${sortConfig.key}&sortOrder=${sortConfig.direction}`);
      setStores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortConfig]);

  const handleRate = async (storeId, rating) => {
    try {
      await api.post(`/users/stores/${storeId}/rate`, { rating });
      fetchStores();
      showToast(`Successfully submitted a ${rating}-star rating!`);
    } catch (err) {
      showToast('Failed to submit rating', 'error');
    }
  };

  const getStoreImage = (name) => {
    if (name.toLowerCase().includes('tech')) return 'https://images.unsplash.com/photo-1550009158-9ebf6c8c73ea?auto=format&fit=crop&q=80&w=500';
    if (name.toLowerCase().includes('book')) return 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=500';
    if (name.toLowerCase().includes('cafe') || name.toLowerCase().includes('bites')) return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=500';
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=500';
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 1rem' }}>
      <div className="hero-banner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)', color: 'white', borderRadius: '24px', padding: '4rem', boxShadow: 'var(--shadow-lg)', border: 'none' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em', color: 'white' }}>
          Discover <span style={{ color: '#93c5fd' }}>Great Stores</span>
        </h1>
        <p style={{ color: '#bfdbfe', fontSize: '1.15rem', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
          Browse local stores, read community ratings, and share your own experiences to help others shop better!
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '800px', background: 'white', padding: '0.75rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={22} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
            <input 
              className="input" 
              placeholder="Search stores by Name or Address..." 
              style={{ paddingLeft: '48px', width: '100%', border: 'none', background: 'transparent', fontSize: '1.05rem', outline: 'none', boxShadow: 'none' }}
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
          <div style={{ position: 'relative', width: '250px', display: 'flex', alignItems: 'center' }}>
            <SortAsc size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
            <select 
              className="input" 
              style={{ paddingLeft: '44px', width: '100%', border: 'none', background: 'transparent', fontSize: '1rem', outline: 'none', boxShadow: 'none', cursor: 'pointer' }} 
              value={`${sortConfig.key}-${sortConfig.direction}`} 
              onChange={e => {
                const [key, direction] = e.target.value.split('-');
                setSortConfig({ key, direction });
              }}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="averageRating-desc">Highest Rated</option>
              <option value="averageRating-asc">Lowest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem', marginTop: '3rem' }}>
        {stores.map((store, i) => (
          <div key={store.id} className={`glass-panel stagger-${(i % 4) + 1}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', borderRadius: '20px', transition: 'all 0.3s ease' }}>
            <div style={{ position: 'relative' }}>
              <img src={getStoreImage(store.name)} alt={store.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <Star size={16} fill="#fbbf24" color="#fbbf24" /> {store.averageRating > 0 ? store.averageRating.toFixed(1) : 'New'}
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{store.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} /> {store.address}
            </p>
            
            <div style={{ marginTop: 'auto', background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Your Rating</span>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: store.userRating ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {store.userRating ? `${store.userRating}/5` : 'Not rated yet'}
                </span>
              </div>
              
              <div className="star-rating" style={{ justifyContent: 'space-between' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => handleRate(store.id, star)}
                  >
                    <Star size={24} fill={store.userRating >= star ? '#fbbf24' : 'transparent'} color={store.userRating >= star ? '#fbbf24' : '#cbd5e1'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <div>Loading amazing stores...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        
        {!loading && stores.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-focus)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No stores found</h3>
            <p style={{ color: 'var(--text-muted)' }}>We couldn't find any stores matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast" style={{ background: toast.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
