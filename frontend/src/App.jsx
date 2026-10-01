import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token && role) {
      setUser({ token, role, name });
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('name', userData.name);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <div className={user ? "app-container" : ""}>
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <div className={user ? "main-content" : "layout-container"}>
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            
            <Route path="/" element={
              !user ? <Navigate to="/login" /> :
              user.role === 'SYSTEM_ADMIN' ? <AdminDashboard /> :
              user.role === 'STORE_OWNER' ? <StoreOwnerDashboard /> :
              <UserDashboard />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
