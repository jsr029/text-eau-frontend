import { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', company: '' });

  const API_URL = 'https://text-eau-backend.vercel.app';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      // Fallback mock
      setUsers([
        { _id: 1, name: 'Admin User', email: 'admin@texteau.com', role: 'admin' },
        { _id: 2, name: 'Client Entreprise', email: 'client@texteau.com', role: 'user' },
      ]);
    }
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Nom et email requis');
      return;
    }
    if (!window.confirm('Voulez-vous vraiment créer cet utilisateur ?')) return;

    try {
      await axios.post(`${API_URL}/api/users`, newUser);
      alert('Utilisateur créé avec succès !');
      setNewUser({ name: '', email: '', role: 'user', company: '' });
      fetchUsers();
    } catch (err) {
      alert('Erreur lors de la création');
    }
  };

  const updateRole = async (id, newRole) => {
    if (!window.confirm(`Changer le rôle en ${newRole} ?`)) return;
    try {
      await axios.put(`${API_URL}/api/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert('Erreur lors de la modification');
    }
  };

  const confirmDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestion des Utilisateurs (SuperAdmin)</h1>

        {/* Formulaire création utilisateur */}
        <div className="bg-white p-8 rounded-3xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">Ajouter un utilisateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              placeholder="Nom complet" 
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="border p-4 rounded-2xl"
            />
            <input 
              placeholder="Email" 
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="border p-4 rounded-2xl"
            />
            <input 
              placeholder="Entreprise (optionnel)" 
              value={newUser.company}
              onChange={(e) => setNewUser({...newUser, company: e.target.value})}
              className="border p-4 rounded-2xl"
            />
            <select 
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              className="border p-4 rounded-2xl"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
              <option value="superAdmin">SuperAdmin</option>
            </select>
          </div>
          <button 
            onClick={createUser}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold"
          >
            Créer Utilisateur
          </button>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-left">Nom</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Rôle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id || u.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium 
                          ${u.role === 'superAdmin' ? 'bg-purple-100 text-purple-700' : 
                            u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button 
                      onClick={() => updateRole(u._id || u.id, u.role === 'admin' ? 'user' : 'admin')}
                      className="text-blue-600 hover:underline"
                    >
                      Changer rôle
                    </button>
                    <button 
                      onClick={() => confirmDelete(u._id || u.id)} 
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;