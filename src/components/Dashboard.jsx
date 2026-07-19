import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: '🏠 Tableau de bord', path: '/dashboard' },
    { label: '👥 Gérer Utilisateurs', path: '/users', role: 'superAdmin' },
    { label: '📋 Bons de Commandes', path: '/orders' },
    { label: '📦 Bons de Livraison', path: '/deliveries' },
    { label: '💰 Factures & Paiements', path: '/invoices' },
  ];

  const filteredMenu = menuItems.filter(item => !item.role || item.role === user.role);

  const confirmAction = (action) => {
    if (window.confirm(`Voulez-vous vraiment ${action} ?`)) {
      alert('✅ Action confirmée !');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden text-2xl"
              >
                ☰
              </button>
              <div className="font-bold text-3xl text-blue-600 tracking-tight">Text'Eau</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm">
                👋 Bienvenue, <span className="font-semibold">{user.name}</span> 
                <span className="text-blue-600 ml-1">({user.role})</span>
              </div>
              <button
                onClick={onLogout}
                className="px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Burger Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {filteredMenu.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="block px-5 py-4 hover:bg-blue-50 rounded-2xl text-gray-700 font-medium transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-gray-600 mb-10">Gestion de votre blanchisserie en temps réel</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-blue-600">24</div>
            <div className="text-gray-500 mt-1">Commandes aujourd'hui</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-green-600">18</div>
            <div className="text-gray-500 mt-1">Livraisons en cours</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-purple-600">12</div>
            <div className="text-gray-500 mt-1">Factures en attente</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-amber-600">98%</div>
            <div className="text-gray-500 mt-1">Satisfaction clients</div>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-8">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button 
              onClick={() => {
                confirmAction('créer une nouvelle commande');
                navigate('/orders');
              }}
              className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-3xl text-left transition-all group"
            >
              <div className="font-semibold text-2xl group-hover:scale-105 transition">📋 Nouvelle Commande</div>
              <div className="text-gray-600 mt-3">Créer un bon + livraison J+1</div>
            </button>

            <button 
              onClick={() => navigate('/invoices')}
              className="p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border border-emerald-200 rounded-3xl text-left transition-all group"
            >
              <div className="font-semibold text-2xl group-hover:scale-105 transition">💰 Gérer Factures</div>
              <div className="text-gray-600 mt-3">Paiements PayPal & CB</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;