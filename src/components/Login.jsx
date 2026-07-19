import { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://text-eau-backend.vercel.app';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Email et mot de passe requis');
      return;
    }
    if (!window.confirm('Voulez-vous vraiment vous connecter ?')) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      onLogin(res.data.user);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert('Identifiants invalides ou serveur indisponible');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!window.confirm('Voulez-vous continuer avec Google ?')) return;
    // Simulation Google (à remplacer par vrai OAuth)
    const mockUser = { 
      id: 'google-' + Date.now(), 
      name: 'Utilisateur Google', 
      email: 'google@texteau.com', 
      role: 'user' 
    };
    onLogin(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Text'Eau</h1>
          <p className="text-gray-500 mt-2">Gestion professionnelle de blanchisserie</p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8">Connexion</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="my-6 text-center text-gray-400">ou</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 py-4 rounded-2xl font-medium transition"
        >
          <span className="text-xl">G</span>
          <span>Continuer avec Google</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-10">
          SuperAdmin : utilisez un email contenant <strong>"super"</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;