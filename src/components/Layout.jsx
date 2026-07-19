import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ user, onLogout, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: '🏠 Tableau de bord', path: '/dashboard' },
    { label: '👥 Gérer Utilisateurs', path: '/users', role: 'superAdmin' },
    { label: '📋 Bons de Commandes', path: '/orders' },
    { label: '📦 Bons de Livraison', path: '/deliveries' },
    { label: '💰 Factures', path: '/invoices' },
  ];

  const filteredMenu = menuItems.filter(item => !item.role || item.role === user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar avec Burger */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 text-2xl hover:bg-gray-100 rounded-xl"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
              <div className="font-bold text-3xl text-blue-600">Text'Eau</div>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {filteredMenu.map((item, idx) => (
                <Link key={idx} to={item.path} className="hover:text-blue-600 font-medium">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm">
                {user.name} <span className="text-blue-600">({user.role})</span>
              </div>
              <button onClick={onLogout} className="px-5 py-2 text-red-600 hover:bg-red-50 rounded-xl">
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-4 py-6 space-y-2">
              {filteredMenu.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className="block px-5 py-4 hover:bg-blue-50 rounded-2xl text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Contenu des pages */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;