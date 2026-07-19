import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './components/Login';
import Layout from './components/Layout';           // ← Nouveau Layout avec Burger Menu
import Dashboard from './components/Dashboard';
import UsersManagement from './components/UsersManagement';
import OrdersManagement from './components/OrdersManagement';
import DeliveriesManagement from './components/DeliveriesManagement';
import InvoicesManagement from './components/InvoicesManagement';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
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
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to="/dashboard" />} />

        {/* Toutes les pages protégées avec Layout (Burger Menu) */}
        <Route path="/*" element={
          user ? (
            <Layout user={user} onLogout={logout}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard user={user} onLogout={logout} />} />
                <Route path="/users" element={user.role === 'superAdmin' ? <UsersManagement user={user} /> : <Navigate to="/dashboard" />} />
                <Route path="/orders" element={<OrdersManagement user={user} />} />
                <Route path="/deliveries" element={<DeliveriesManagement user={user} />} />
                <Route path="/invoices" element={<InvoicesManagement user={user} />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;