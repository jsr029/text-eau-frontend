import { useState, useEffect } from 'react';
import api from '../api/axios';
import jsPDF from 'jspdf';

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

  const generateOrderPDF = (order) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("Text'Eau - Bon de Commande", 20, 25);

    doc.setFontSize(12);
    doc.text(`Numéro : ${order.orderNumber}`, 20, 45);
    doc.text(`Client : ${order.client}`, 20, 55);
    doc.text(`Entreprise : ${order.company}`, 20, 65);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 20, 75);

    doc.text("Articles :", 20, 95);
    let y = 105;
    order.items.forEach(item => {
      doc.text(`• ${item.article} × ${item.quantity} = ${item.quantity * (item.price || 0)} €`, 20, y);
      y += 10;
    });

    doc.setFontSize(16);
    doc.text(`TOTAL : ${order.totalAmount} €`, 20, y + 15);

    doc.setFontSize(10);
    doc.text("Merci pour votre confiance !", 20, y + 35);

    // Ouvrir dans nouvel onglet + téléchargement
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');

    // Téléchargement automatique
    const link = document.createElement('a');
    link.href = url;
    link.download = `Commande_${order.orderNumber}.pdf`;
    link.click();

    return doc;
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

      alert(`✅ Commande ${res.data.order.orderNumber} créée !`);

      // Générer PDF automatiquement
      generateOrderPDF(res.data.order);

      setOrders([res.data.order, ...orders]);
      setNewOrder({ client: '', company: '', items: [{article: '', quantity: 1, price: 0}], totalAmount: 0 });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Erreur lors de la création');
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
        
        {/* Formulaire création */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6">Créer une nouvelle commande</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input placeholder="Nom du Client *" value={newOrder.client} onChange={(e) => setNewOrder({...newOrder, client: e.target.value})} className="border p-4 rounded-2xl" />
            <input placeholder="Nom de l'Entreprise *" value={newOrder.company} onChange={(e) => setNewOrder({...newOrder, company: e.target.value})} className="border p-4 rounded-2xl" />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Articles *</h3>
            {newOrder.items.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4 items-end">
                <input placeholder="Article" value={item.article} onChange={(e) => updateItem(index, 'article', e.target.value)} className="flex-1 border p-3 rounded-xl" />
                <input type="number" placeholder="Qté" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="w-24 border p-3 rounded-xl" />
                <button onClick={() => removeItem(index)} className="text-red-500 px-3">✕</button>
              </div>
            ))}
            <button onClick={addItem} className="text-blue-600 underline">+ Ajouter article</button>
          </div>

          <button onClick={createOrder} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold">
            Créer Commande + Générer PDF
          </button>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-3xl shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-xl">Commandes récentes ({orders.length})</h3>
          </div>
          {orders.length === 0 ? (
            <p className="p-12 text-center text-gray-500">Aucune commande pour le moment</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className="p-6 border-b flex justify-between items-center hover:bg-gray-50">
                <div>
                  <div className="font-mono font-bold">{order.orderNumber}</div>
                  <div>{order.client} • {order.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold">{order.totalAmount} €</div>
                  <button 
                    onClick={() => {
                      const doc = new jsPDF();
                      // ... (même logique que generateOrderPDF)
                      const pdfBlob = doc.output('blob');
                      const url = URL.createObjectURL(pdfBlob);
                      window.open(url, '_blank');
                    }}
                    className="mt-2 text-blue-600 text-sm underline"
                  >
                    📄 Télécharger PDF
                  </button>
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