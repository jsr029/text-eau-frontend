import { useState, useEffect } from 'react';
import axios from 'axios';

const InvoicesManagement = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const API_URL = 'https://text-eau-backend.vercel.app';

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Pour l'instant on récupère les commandes en attente de paiement
      const res = await axios.get(`${API_URL}/api/orders`);
      setInvoices(res.data.filter(o => o.paymentStatus !== 'paid'));
    } catch (err) {
      console.error(err);
      // Données de test
      setInvoices([
        { _id: 1, orderNumber: 'CMD-2026-0001', client: 'Entreprise ABC', totalAmount: 245, status: 'pending' },
        { _id: 2, orderNumber: 'CMD-2026-0002', client: 'Société XYZ', totalAmount: 189, status: 'pending' },
      ]);
    }
  };

  const payInvoice = async (invoice) => {
    if (!window.confirm(`Voulez-vous payer la facture ${invoice.orderNumber} (${invoice.totalAmount} €) ?`)) return;

    try {
      const res = await axios.post(`${API_URL}/api/payments/create-paypal-order`, {
        orderId: invoice._id,
        amount: invoice.totalAmount
      });

      alert('Redirection vers PayPal...');
      // Simulation paiement réussi
      setTimeout(async () => {
        await axios.post(`${API_URL}/api/payments/capture-paypal-order`, { orderId: invoice._id });
        alert('✅ Paiement PayPal / Carte Bancaire réussi !');
        fetchInvoices();
      }, 1500);
    } catch (err) {
      alert('Erreur lors du paiement');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des Factures</h1>
          <button 
            onClick={fetchInvoices}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-xl text-sm font-medium"
          >
            Rafraîchir
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="font-semibold text-xl">Factures en attente de paiement</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              Aucune facture en attente
            </div>
          ) : (
            invoices.map(invoice => (
              <div key={invoice._id} className="p-6 border-b hover:bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <div className="font-mono font-bold text-lg">{invoice.orderNumber}</div>
                  <div className="text-gray-600">{invoice.client}</div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-2xl font-semibold text-red-600">{invoice.totalAmount} €</div>
                  <div className="text-sm text-gray-500">À régler</div>
                </div>

                <button
                  onClick={() => payInvoice(invoice)}
                  className="bg-green-600 hover:bg-green-700 text-white px-10 py-3.5 rounded-2xl font-semibold flex items-center gap-2 whitespace-nowrap"
                >
                  💳 Payer maintenant (PayPal / CB)
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Paiements sécurisés via PayPal • Support CB, Visa, Mastercard
        </div>
      </div>
    </div>
  );
};

export default InvoicesManagement;