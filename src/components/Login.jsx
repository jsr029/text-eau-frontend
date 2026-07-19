import { useState } from 'react';
import api from '../api/axios';   // ← Instance axios avec token

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm(isLogin ? 'Se connecter ?' : 'Créer le compte ?')) return;

    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password, company };

      const res = await api.post(endpoint, payload);   // ← Utilisation de api (token automatique)

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      onLogin(res.data.user);
      window.location.href = '/dashboard';
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!window.confirm('Continuer avec Google ?')) return;
    
    const mockUser = { 
      id: 'google-' + Date.now(), 
      name: 'Utilisateur Google', 
      email: email || 'google@texteau.com', 
      role: email.toLowerCase().includes('super') ? 'superAdmin' : 'user' 
    };
    
    onLogin(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">Text'Eau</h1>
        <p className="text-center text-gray-500 mb-8">Gestion Blanchisserie SaaS</p>

        <div className="flex border-b mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 font-medium ${isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Connexion
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 font-medium ${!isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <input type="text" placeholder="Nom complet" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 border rounded-2xl" required />
              <input type="text" placeholder="Entreprise (optionnel)" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-4 border rounded-2xl" />
            </>
          )}

          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border rounded-2xl" required />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border rounded-2xl" required />

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg">
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "Créer mon compte")}
          </button>
        </form>

        <button 
          onClick={handleGoogleLogin} 
          className="mt-6 w-full border py-4 rounded-2xl hover:bg-gray-50 font-medium"
        >
          Continuer avec Google
        </button>
      </div>
    </div>
  );
};

export default Login;