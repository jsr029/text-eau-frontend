import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UsersManagement from './components/UsersManagement';
import OrdersManagement from './components/OrdersManagement';
import DeliveriesManagement from './components/DeliveriesManagement';
import InvoicesManagement from './components/InvoicesManagement';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/users" 
          element={user && user.role === 'superAdmin' ? <UsersManagement user={user} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/orders" 
          element={user ? <OrdersManagement user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/deliveries" 
          element={user ? <DeliveriesManagement user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/invoices" 
          element={user ? <InvoicesManagement user={user} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
