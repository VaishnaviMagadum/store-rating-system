import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, SortAsc, MapPin, Star, Heart, Award, TrendingUp, X, Clock, Phone, Globe } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favStores') || '[]'));
  const [selectedStore, setSelectedStore] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('favStores', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const filteredStores = stores.filter(s => category === 'All' || s.name.toLowerCase().includes(category.toLowerCase()));

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

  const getStoreImage = (name, id) => {
    const n = name.toLowerCase();
    
    // Hash function for pseudo-random selection based on ID
    const idx = (id || 0);

    const techImages = [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=500'
    ];
    
    const freshImages = [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=500'
    ];
    
    const fashionImages = [
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=500'
    ];
    
    const gadgetImages = [
      'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80&w=500'
    ];
    
    const dailyImages = [
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=500'
    ];
    
    const cafeImages = [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=500'
    ];
    
    const bookImages = [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=500', 
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=500',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=500'
    ];
    
    if (n.includes('vaishnavi') || n.includes('lense') || n.includes('card')) return 'https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=500';
    if (n.includes('tech') || n.includes('computer')) return techImages[idx % techImages.length];
    if (n.includes('fresh') || n.includes('grocer') || n.includes('bites')) return freshImages[idx % freshImages.length];
    if (n.includes('fashion') || n.includes('boutique') || n.includes('cloth') || n.includes('outlet')) return fashionImages[idx % fashionImages.length];
    if (n.includes('gadget') || n.includes('electron')) return gadgetImages[idx % gadgetImages.length];
    if (n.includes('daily') || n.includes('essential') || n.includes('mart')) return dailyImages[idx % dailyImages.length];
    if (n.includes('cafe') || n.includes('coffee')) return cafeImages[idx % cafeImages.length];
    if (n.includes('book') || n.includes('read')) return bookImages[idx % bookImages.length];
    
    // Completely generic fallbacks using picsum seed based on store ID
    return `https://picsum.photos/seed/${id || Math.random()}/500/300`;
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
        
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '800px', background: 'var(--bg-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
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
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          {['All', 'Tech', 'Fresh', 'Fashion', 'Gadget', 'Daily', 'Lense'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
                color: category === cat ? 'white' : 'var(--text-muted)',
                border: `1px solid ${category === cat ? 'transparent' : 'var(--border-color)'}`,
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.3s',
                boxShadow: category === cat ? '0 4px 15px rgba(138, 43, 226, 0.3)' : 'none',
                backdropFilter: 'blur(8px)'
              }}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem', marginTop: '3rem' }}>
        {filteredStores.map((store, i) => (
          <div key={store.id} className={`glass-panel stagger-${(i % 4) + 1}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', borderRadius: '20px', transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => setSelectedStore(store)}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <img src={getStoreImage(store.name, store.id)} alt={store.name} className="store-image" style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'transform 0.5s ease', marginBottom: 0 }} />
              
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                {store.averageRating >= 4.0 && (
                  <div style={{ background: 'linear-gradient(135deg, #ff006e, #8a2be2)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '0.75rem', color: 'white', boxShadow: '0 4px 15px rgba(255, 0, 110, 0.4)' }}>
                    <Award size={14} /> TOP RATED
                  </div>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(store.id); }}
                  style={{ background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: favorites.includes(store.id) ? '#ff006e' : 'white', transition: 'all 0.3s' }}
                >
                  <Heart size={18} fill={favorites.includes(store.id) ? '#ff006e' : 'transparent'} />
                </button>
              </div>

              <div style={{ position: 'absolute', bottom: '36px', left: '12px', background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '0.9rem', color: '#fee440', border: '1px solid rgba(254, 228, 64, 0.3)' }}>
                <Star size={16} fill="#fee440" /> {store.averageRating > 0 ? store.averageRating.toFixed(1) : 'New'}
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{store.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} /> {store.address}
            </p>
            
            <div style={{ marginTop: 'auto', background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }} onClick={e => e.stopPropagation()}>
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
        
        {!loading && filteredStores.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-focus)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No stores found</h3>
            <p style={{ color: 'var(--text-muted)' }}>We couldn't find any stores matching your criteria.</p>
          </div>
        )}
      </div>

      {selectedStore && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedStore(null)}>
          <div className="animate-fade-in" style={{ width: '90%', maxWidth: '800px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative', height: '280px' }}>
              <img src={getStoreImage(selectedStore.name, selectedStore.id)} alt={selectedStore.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,1), transparent)' }} />
              <button 
                onClick={() => setSelectedStore(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'white' }}
              >
                <X size={24} />
              </button>
              <div style={{ position: 'absolute', bottom: '20px', left: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{selectedStore.name}</h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span className="badge badge-owner">{selectedStore.name.split(' ')[0]}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fee440', fontWeight: 'bold' }}>
                    <Star size={18} fill="#fee440" /> {selectedStore.averageRating > 0 ? selectedStore.averageRating.toFixed(1) : 'New'}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '2rem 3rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>About the Store</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Experience top-tier service and incredible products at {selectedStore.name}. 
                  Rated highly by the community, this establishment is a must-visit location!
                </p>
                
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Your Rating</h3>
                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                  <div className="star-rating" style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={() => { handleRate(selectedStore.id, star); setSelectedStore({...selectedStore, userRating: star}); }}
                      >
                        <Star size={28} fill={selectedStore.userRating >= star ? '#fbbf24' : 'transparent'} color={selectedStore.userRating >= star ? '#fbbf24' : '#cbd5e1'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-muted)' }}>
                  <MapPin size={20} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Location</strong>
                    {selectedStore.address}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-muted)' }}>
                  <Clock size={20} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Hours</strong>
                    Mon-Sun: 9:00 AM - 9:00 PM
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-muted)' }}>
                  <Phone size={20} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Contact</strong>
                    (555) 123-4567
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-muted)' }}>
                  <Globe size={20} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Website</strong>
                    <a href="#" style={{ color: 'var(--primary)' }}>www.{selectedStore.name.replace(/\s+/g, '').toLowerCase()}.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
