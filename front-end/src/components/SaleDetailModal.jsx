// 📁 src/components/SaleDetailModal.jsx

import React from 'react';

const SaleDetailModal = ({ sale, onClose }) => {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Détails de la vente</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Article :</strong> {sale.articleName}</p>
          <p><strong>Quantité vendue :</strong> {sale.quantitySold}</p>
          <p><strong>Stock restant :</strong> {sale.stock}</p>
          <p><strong>Prix unitaire :</strong> €{sale.price.toFixed(2)}</p>
          <p><strong>Numéro du ticket :</strong> {sale.ticketNo}</p>
          <p><strong>Vendeur :</strong> {sale.sellerName}</p>
          <p><strong>Date de vente :</strong> {new Date(sale.date).toLocaleString()}</p>
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailModal;
