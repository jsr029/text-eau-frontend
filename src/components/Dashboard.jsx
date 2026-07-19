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