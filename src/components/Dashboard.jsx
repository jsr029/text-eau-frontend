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
      {/* Navbar avec Burger Menu */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {/* Burger Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 rounded-xl hover:bg-gray-100 text-2xl"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
              <div className="font-bold text-3xl text-blue-600">Text'Eau</div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {filteredMenu.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="hover:text-blue-600 transition font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-gray-600">
                {user.name} <span className="text-blue-600">({user.role})</span>
              </div>
              <button
                onClick={onLogout}
                className="px-5 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile (Burger) */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg">
            <div className="px-4 py-6 space-y-2">
              {filteredMenu.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="block px-5 py-4 text-lg hover:bg-blue-50 rounded-2xl transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={onLogout}
                className="w-full text-left px-5 py-4 text-red-600 hover:bg-red-50 rounded-2xl mt-4"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-gray-600 mb-10">Bienvenue dans votre espace de gestion de blanchisserie</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-blue-600">24</div>
            <div className="text-gray-500">Commandes aujourd'hui</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-green-600">18</div>
            <div className="text-gray-500">Livraisons en cours</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-purple-600">12</div>
            <div className="text-gray-500">Factures en attente</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="text-4xl font-bold text-amber-600">98%</div>
            <div className="text-gray-500">Satisfaction client</div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-8">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => { confirmAction('créer une nouvelle commande'); navigate('/orders'); }}
              className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 border border-blue-200 rounded-3xl text-left transition"
            >
              <div className="font-semibold text-2xl">📋 Nouvelle Commande</div>
              <div className="text-gray-600 mt-2">Créer un bon + livraison J+1</div>
            </button>
            <button 
              onClick={() => navigate('/invoices')}
              className="p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 border border-emerald-200 rounded-3xl text-left transition"
            >
              <div className="font-semibold text-2xl">💰 Gérer Factures</div>
              <div className="text-gray-600 mt-2">Paiements PayPal / CB</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;