import React, { useState } from 'react';
import axios from 'axios';

const InventoryEditModal = ({ inventory, onClose, onSaved }) => {
  const [entries, setEntries] = useState(
    inventory.entries.map(e => ({ ...e, counted: e.counted || 0 }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (idx, value) => {
    setEntries(prev => prev.map((e, i) => i === idx ? { ...e, counted: value } : e));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.put(`http://localhost:5000/pamoja/api/inventories/updateInventory/${inventory.id}`,
        {
          date: inventory.date,
          zoneId: inventory.zoneId,
          entries: entries.map(e => ({ articleId: e.article.id, counted: parseInt(e.counted) || 0 }))
        }
      );
      onSaved();
      onClose();
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded shadow-lg max-w-lg w-full z-10">
        <h2 className="text-lg font-bold mb-2 text-rose-700">Éditer l'inventaire</h2>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr>
              <th className="p-2 border">Article</th>
              <th className="p-2 border">Quantité comptée</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, idx) => (
              <tr key={e.id}>
                <td className="p-2 border">{e.article?.name || ''}</td>
                <td className="p-2 border">
                  <input type="number" value={e.counted} min={0} className="border px-2 py-1 rounded w-24"
                    onChange={ev => handleChange(idx, ev.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-rose-600 text-white rounded">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryEditModal;
