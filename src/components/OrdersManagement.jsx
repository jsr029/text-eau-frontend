import { useState, useEffect } from 'react';
import axios from 'axios';

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
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Erreur fetch orders:', err);
      // Fallback mock data
      setOrders([]);
    }
  };

  const createOrder = async () => {
    if (!newOrder.client || !newOrder.company) {
      alert('Client et entreprise requis');
      return;
    }
    if (!window.confirm('Voulez-vous vraiment créer cette commande ?')) return;
    
    try {
      const res = await axios.post('http://localhost:5000/api/orders', newOrder);
      alert(`✅ Commande ${res.data.order.orderNumber} créée ! Bon de livraison J+1 généré.`);
      setOrders([res.data.order, ...orders]);
      setNewOrder({ client: '', company: '', items: [{article: '', quantity: 1, price: 0}], totalAmount: 0 });
    } catch (err) {
      alert('Erreur lors de la création de la commande');
      console.error(err);
    }
  };

  const addItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, {article: '', quantity: 1, price: 0}]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestion des Bons de Commandes</h1>
        
        {/* Formulaire création */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">Créer une nouvelle commande</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input 
              placeholder="Nom du Client" 
              value={newOrder.client}
              onChange={(e) => setNewOrder({...newOrder, client: e.target.value})}
              className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500"
            />
            <input 
              placeholder="Nom de l'Entreprise" 
              value={newOrder.company}
              onChange={(e) => setNewOrder({...newOrder, company: e.target.value})}
              className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Articles</h3>
            {newOrder.items.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input 
                  placeholder="Article (ex: Chemises)" 
                  value={item.article}
                  onChange={(e) => {
                    const updated = [...newOrder.items];
                    updated[index].article = e.target.value;
                    setNewOrder({...newOrder, items: updated});
                  }}
                  className="flex-1 border p-3 rounded-xl"
                />
                <input 
                  type="number" 
                  placeholder="Qté" 
                  value={item.quantity}
                  onChange={(e) => {
                    const updated = [...newOrder.items];
                    updated[index].quantity = parseInt(e.target.value);
                    setNewOrder({...newOrder, items: updated});
                  }}
                  className="w-24 border p-3 rounded-xl"
                />
              </div>
            ))}
            <button onClick={addItem} className="text-blue-600 underline text-sm">+ Ajouter article</button>
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
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-semibold text-xl">Commandes récentes ({orders.length})</h3>
          </div>
          {orders.length === 0 ? (
            <p className="p-12 text-center text-gray-500">Aucune commande pour le moment</p>
          ) : (
            orders.map(order => (
              <div key={order._id || order.orderNumber} className="p-6 border-b hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-mono font-bold">{order.orderNumber}</div>
                  <div>{order.client} • {order.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{order.totalAmount} €</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.deliveryDate || order.createdAt).toLocaleDateString('fr-FR')}
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
