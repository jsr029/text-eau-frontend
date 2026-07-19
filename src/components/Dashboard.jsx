import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Tableau de bord', path: '/dashboard' },
    { label: 'Gérer Utilisateurs', path: '/users', role: 'superAdmin' },
    { label: 'Bons de Commandes', path: '/orders' },
    { label: 'Bons de Livraison', path: '/deliveries' },
    { label: 'Factures', path: '/invoices' },
  ];

  const filteredMenu = menuItems.filter(item => !item.role || item.role === user.role);

  const confirmAction = (action) => {
    if (window.confirm(`Voulez-vous vraiment ${action} ?`)) {
      // action logic
      alert('Action confirmée !');
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
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                ☰
              </button>
              <div className="font-bold text-2xl text-blue-600">Text'Eau</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                Bienvenue, {user.name} ({user.role})
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Burger Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-1">
              {filteredMenu.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="block px-4 py-3 hover:bg-gray-100 rounded-lg text-gray-700 font-medium"
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
        <h1 className="text-4xl font-bold mb-8">Tableau de Bord - Blanchisserie</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="text-3xl font-bold text-blue-600">24</div>
            <div className="text-gray-500">Commandes aujourd'hui</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="text-3xl font-bold text-green-600">18</div>
            <div className="text-gray-500">Livraisons en cours</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="text-3xl font-bold text-purple-600">12</div>
            <div className="text-gray-500">Factures en attente</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="text-3xl font-bold text-amber-600">98%</div>
            <div className="text-gray-500">Satisfaction client</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => confirmAction('créer une nouvelle commande')}
              className="p-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl text-left transition"
            >
              <div className="font-semibold text-xl">Nouvelle Commande</div>
              <div className="text-sm text-gray-600 mt-1">Créer un bon pour un client</div>
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="p-6 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-left transition"
            >
              <div className="font-semibold text-xl">Gérer Commandes</div>
              <div className="text-sm text-gray-600 mt-1">Voir & modifier les bons</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
