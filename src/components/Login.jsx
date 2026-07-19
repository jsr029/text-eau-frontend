import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogle, setIsGoogle] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate auth
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: email || 'user@texteau.com',
      role: 'user' // default, superAdmin for demo
    };
    if (email.includes('super')) mockUser.role = 'superAdmin';
    onLogin(mockUser);
  };

  const handleGoogleLogin = () => {
    // Simulate Google
    const mockUser = { id: 2, name: 'Google User', email: 'google@texteau.com', role: 'user' };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Text'Eau</h1>
        <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
          >
            <span>Continuer avec Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Plateforme SaaS de gestion de blanchisserie
        </p>
      </div>
    </div>
  );
};

export default Login;
