// StockMovementModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const StockMovementModal = ({ stock, onClose }) => {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) return alert("Quantité invalide");
    try {
      await axios.post(
        "http://localhost:5000/pamoja/api/stockMovements",
        {
          articleId: stock.article.id,
          zoneId: stock.zone.id,
          quantity: parseInt(quantity),
          type: 'ENTRY',
          reason
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du mouvement", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded shadow-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Entrée en stock</h2>
        <p className="mb-2 text-sm text-gray-600">Article : <strong>{stock.article.name}</strong></p>
        <p className="mb-2 text-sm text-gray-600">Zone : <strong>{stock.zone.name}</strong></p>
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantité"
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <input
          type="text"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Raison de l'entrée"
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Annuler</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Valider</button>
        </div>
      </div>
    </div>
  );
};

export default StockMovementModal;