import jsPDF from 'jspdf';

export const generateOrderPDF = (order) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("Text'Eau - Bon de Commande", 20, 20);

  doc.setFontSize(12);
  doc.text(`Numéro : ${order.orderNumber}`, 20, 40);
  doc.text(`Client : ${order.client}`, 20, 50);
  doc.text(`Entreprise : ${order.company}`, 20, 60);
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 20, 70);

  doc.text("Articles :", 20, 90);
  let y = 100;
  order.items.forEach(item => {
    doc.text(`- ${item.article} × ${item.quantity} = ${item.quantity * item.price} €`, 20, y);
    y += 10;
  });

  doc.setFontSize(14);
  doc.text(`Total : ${order.totalAmount} €`, 20, y + 10);

  doc.save(`Commande_${order.orderNumber}.pdf`);
  return doc;
};

export const generateDeliveryPDF = (delivery) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text("Text'Eau - Bon de Livraison", 20, 20);

  doc.setFontSize(12);
  doc.text(`Numéro : ${delivery.deliveryNumber}`, 20, 40);
  doc.text(`Commande liée : ${delivery.order?.orderNumber || 'N/A'}`, 20, 50);
  doc.text(`Client : ${delivery.client}`, 20, 60);
  doc.text(`Date de livraison : ${new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}`, 20, 70);

  doc.text("Articles à livrer :", 20, 90);
  let y = 100;
  delivery.items.forEach(item => {
    doc.text(`- ${item.article} × ${item.quantity}`, 20, y);
    y += 10;
  });

  doc.save(`Livraison_${delivery.deliveryNumber}.pdf`);
  return doc;
};