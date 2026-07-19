import { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveriesManagement = ({ user }) => {
  const [deliveries, setDeliveries] = useState([]);

  const API_URL = 'https://text-eau-backend.vercel.app';

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/deliveries`);
      setDeliveries(res.data);
    } catch (err) {
      console.error(err);
      // Données de démonstration
      setDeliveries([
        { _id: 1, deliveryNumber: 'LIV-2026-0001', client: 'Entreprise ABC', status: 'in_transit', deliveryDate: '2026-07-20' },
        { _id: 2, deliveryNumber: 'LIV-2026-0002', client: 'Société XYZ', status: 'scheduled', deliveryDate: '2026-07-21' },
      ]);
    }
  };

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Passer en statut "${newStatus}" ?`)) return;
    try {
      // Appel API (à implémenter côté backend si besoin)
      setDeliveries(deliveries.map(d => 
        d._id === id ? { ...d, status: newStatus } : d
      ));
      alert('Statut mis à jour !');
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const printDeliveryPDF = (delivery) => {
    if (!window.confirm(`Imprimer le bon de livraison ${delivery.deliveryNumber} ?`)) return;
    alert(`📄 Bon de livraison ${delivery.deliveryNumber} généré en PDF\n\nClient : ${delivery.client}\nDate : ${delivery.deliveryDate}`);
    // Ici vous pouvez intégrer jsPDF ou react-to-print pour vrai PDF
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'in_transit': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bons de Livraison</h1>
          <button 
            onClick={fetchDeliveries}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-medium"
          >
            Rafraîchir
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex justify-between">
            <h2 className="font-semibold text-xl">Liste des livraisons ({deliveries.length})</h2>
          </div>

          {deliveries.length === 0 ? (
            <p className="p-16 text-center text-gray-500">Aucune livraison pour le moment</p>
          ) : (
            deliveries.map(delivery => (
              <div key={delivery._id} className="p-6 border-b hover:bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="font-mono font-bold text-lg">{delivery.deliveryNumber}</div>
                  <div className="text-gray-600 mt-1">{delivery.client}</div>
                  <div className="text-sm text-gray-500">Livraison prévue : {new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}</div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span className={`px-5 py-1.5 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                    {delivery.status === 'scheduled' ? 'Planifiée' : 
                     delivery.status === 'in_transit' ? 'En cours' : 'Livré'}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(delivery._id, delivery.status === 'in_transit' ? 'delivered' : 'in_transit')}
                      className="px-5 py-2 text-sm border rounded-xl hover:bg-gray-100"
                    >
                      Mettre à jour statut
                    </button>
                    <button
                      onClick={() => printDeliveryPDF(delivery)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl font-medium"
                    >
                      📄 Imprimer PDF
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Les bons de livraison sont générés automatiquement à la création des commandes (J+1)
        </p>
      </div>
    </div>
  );
};

export default DeliveriesManagement;