import { useState, useEffect } from 'react';
import api from '../api/axios';

const OrdersManagement = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ 
    client: '', 
    company: '', 
    items: [{article: '', quantity: 1, price: 0}], 
    totalAmount: 0 
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0);
  };

  const createOrder = async () => {
    if (!newOrder.client || !newOrder.company) {
      alert('Client et entreprise sont obligatoires');
      return;
    }
    if (newOrder.items.length === 0 || newOrder.items.some(i => !i.article)) {
      alert('Au moins un article valide est requis');
      return;
    }

    if (!window.confirm('Voulez-vous vraiment créer cette commande ?')) return;

    try {
      const orderData = {
        ...newOrder,
        totalAmount: calculateTotal(newOrder.items)
      };

      const res = await api.post('/api/orders', orderData);

      alert(`✅ Commande ${res.data.order.orderNumber} créée avec succès !\nBon de livraison J+1 généré.`);
      
      setOrders([res.data.order, ...orders]);
      setNewOrder({ 
        client: '', 
        company: '', 
        items: [{article: '', quantity: 1, price: 0}], 
        totalAmount: 0 
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Erreur lors de la création de la commande');
    }
  };

  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, {article: '', quantity: 1, price: 0}]
    });
  };

  const removeItem = (index) => {
    if (newOrder.items.length === 1) return alert('Au moins un article est requis');
    const updated = [...newOrder.items];
    updated.splice(index, 1);
    setNewOrder({...newOrder, items: updated});
  };

  const updateItem = (index, field, value) => {
    const updated = [...newOrder.items];
    updated[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
    setNewOrder({...newOrder, items: updated});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestion des Bons de Commandes</h1>
        
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">Créer une nouvelle commande</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input 
              placeholder="Nom du Client *" 
              value={newOrder.client}
              onChange={(e) => setNewOrder({...newOrder, client: e.target.value})}
              className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              placeholder="Nom de l'Entreprise *" 
              value={newOrder.company}
              onChange={(e) => setNewOrder({...newOrder, company: e.target.value})}
              className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Articles *</h3>
            {newOrder.items.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4 items-end">
                <input 
                  placeholder="Article (ex: Chemises)" 
                  value={item.article}
                  onChange={(e) => updateItem(index, 'article', e.target.value)}
                  className="flex-1 border p-3 rounded-xl"
                />
                <input 
                  type="number" 
                  placeholder="Qté" 
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  className="w-24 border p-3 rounded-xl"
                />
                <button 
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 px-3 py-3"
                >
                  ✕
                </button>
              </div>
            ))}
            <button onClick={addItem} className="text-blue-600 underline text-sm hover:text-blue-700">+ Ajouter un article</button>
          </div>

          <button 
            onClick={createOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg transition"
          >
            Créer Commande + Générer Bon Livraison (PDF J+1)
          </button>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-3xl shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-xl">Commandes récentes ({orders.length})</h3>
          </div>
          {orders.length === 0 ? (
            <p className="p-12 text-center text-gray-500">Aucune commande pour le moment</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="p-6 border-b hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <span className="font-mono font-bold">{order.orderNumber}</span>
                    <span className="ml-3 text-gray-600">{order.client} • {order.company}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">{order.totalAmount} €</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;