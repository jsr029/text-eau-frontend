import { useState, useEffect } from 'react';
import api from '../api/axios';
import jsPDF from 'jspdf';

const DeliveriesManagement = ({ user }) => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/api/deliveries');
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
      setDeliveries([]);
    }
  };

  const generateDeliveryPDF = (delivery) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Text'Eau - Bon de Livraison", 20, 25);

    doc.setFontSize(12);
    doc.text(`Numéro : ${delivery.deliveryNumber}`, 20, 45);
    doc.text(`Client : ${delivery.client}`, 20, 55);
    doc.text(`Entreprise : ${delivery.company}`, 20, 65);
    doc.text(`Date : ${new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}`, 20, 75);

    doc.text("Articles :", 20, 95);
    let y = 105;
    delivery.items.forEach(item => {
      doc.text(`• ${item.article} × ${item.quantity}`, 20, y);
      y += 10;
    });

    doc.setFontSize(14);
    doc.text("Statut : " + (delivery.status === 'delivered' ? 'Livré' : 'En cours'), 20, y + 15);

    doc.setFontSize(10);
    doc.text("Merci pour votre confiance !", 20, y + 35);

    // Téléchargement + ouverture nouvel onglet
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    // Ouvrir dans nouvel onglet
    window.open(url, '_blank');
    
    // Téléchargement automatique
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bon_Livraison_${delivery.deliveryNumber}.pdf`;
    link.click();
  };

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Changer le statut en "${newStatus}" ?`)) return;
    // Appel API (à implémenter si nécessaire)
    setDeliveries(deliveries.map(d => d._id === id ? { ...d, status: newStatus } : d));
    alert('Statut mis à jour !');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bons de Livraison</h1>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          {deliveries.length === 0 ? (
            <p className="p-16 text-center text-gray-500">Aucune livraison</p>
          ) : (
            deliveries.map(delivery => (
              <div key={delivery._id} className="p-6 border-b hover:bg-gray-50 flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <div className="font-mono font-bold text-lg">{delivery.deliveryNumber}</div>
                  <div className="text-gray-600">{delivery.client} • {delivery.company}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`px-5 py-1.5 rounded-full text-sm ${delivery.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {delivery.status === 'delivered' ? 'Livré' : 'En cours'}
                  </span>

                  <button
                    onClick={() => generateDeliveryPDF(delivery)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-medium flex items-center gap-2"
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

export default DeliveriesManagement;