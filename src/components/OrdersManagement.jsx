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

      // Générer PDF
      generateOrderPDF(res.data.order);

      setOrders([res.data.order, ...orders]);
      setNewOrder({ client: '', company: '', items: [{article: '', quantity: 1, price: 0}], totalAmount: 0 });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création');
    }
  };

  const generateOrderPDF = (order) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("Text'Eau - Bon de Commande", 20, 25);

    doc.setFontSize(12);
    doc.text(`Numéro : ${order.orderNumber}`, 20, 45);
    doc.text(`Client : ${order.client}`, 20, 55);
    doc.text(`Entreprise : ${order.company}`, 20, 65);

    doc.text("Articles :", 20, 85);
    let y = 95;
    order.items.forEach(item => {
      doc.text(`• ${item.article} × ${item.quantity} × ${item.price}€ = ${item.quantity * item.price}€`, 20, y);
      y += 10;
    });

    doc.setFontSize(16);
    doc.text(`TOTAL : ${order.totalAmount} €`, 20, y + 15);

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');

    const link = document.createElement('a');
    link.href = url;
    link.download = `Commande_${order.orderNumber}.pdf`;
    link.click();
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
    setNewOrder({...newOrder, items: updated, totalAmount: calculateTotal(updated)});
  };

  const updateItem = (index, field, value) => {
    const updated = [...newOrder.items];
    updated[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setNewOrder({...newOrder, items: updated, totalAmount: calculateTotal(updated)});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gestion des Bons de Commandes</h1>
        
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
                <input type="number" placeholder="Qté" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="w-20 border p-3 rounded-xl" />
                <input type="number" placeholder="Prix €" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} className="w-24 border p-3 rounded-xl" />
                <button onClick={() => removeItem(index)} className="text-red-500 px-3">✕</button>
              </div>
            ))}
            <button onClick={addItem} className="text-blue-600 underline">+ Ajouter article</button>
          </div>

          <div className="text-right mb-6 text-2xl font-bold">
            Total : {calculateTotal(newOrder.items)} €
          </div>

          <button onClick={createOrder} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg">
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
              <div key={order._id} className="p-6 border-b hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-mono font-bold">{order.orderNumber}</div>
                    <div>{order.client} • {order.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold">{order.totalAmount} €</div>
                    <button onClick={() => generateOrderPDF(order)} className="text-blue-600 text-sm underline mt-2">📄 PDF</button>
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