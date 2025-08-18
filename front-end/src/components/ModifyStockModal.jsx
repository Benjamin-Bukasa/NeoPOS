import React, { useState } from 'react';
import axios from 'axios';

const ModifyStockModal = ({ stock, onClose }) => {
  const [newQty, setNewQty] = useState(stock.quantity);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/pamoja/api/stocks/updateStock/${stock.id}`, {
        quantity: parseInt(newQty)
      });
      onClose();
    } catch (err) {
      console.error("Erreur modification stock", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded shadow-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Modifier quantité</h2>
        <p className="mb-2 text-sm text-gray-600">Article : <strong>{stock.article.name}</strong></p>
        <p className="mb-2 text-sm text-gray-600">Zone : <strong>{stock.zone.name}</strong></p>
        <input
          type="number"
          value={newQty}
          onChange={e => setNewQty(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Annuler</button>
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Mettre à jour</button>
        </div>
      </div>
    </div>
  );
};

export default ModifyStockModal;
