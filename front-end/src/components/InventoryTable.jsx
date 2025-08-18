// InventoryTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipboardCheck } from 'lucide-react';

import { useUserStore } from '../stores/useUserStore';


const InventoryTable = () => {
  const [articles, setArticles] = useState([]);
  const [inventoryDate, setInventoryDate] = useState(new Date().toISOString().slice(0, 10));
  const [counted, setCounted] = useState({});
  const { user } = useUserStore();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pamoja/api/articles/getAllArticles');
        setArticles(response.data);
        const countedInit = {};
        response.data.forEach(a => countedInit[a.id] = '');
        setCounted(countedInit);
      } catch (err) {
        console.error("Erreur de chargement des articles", err);
      }
    };
    fetchArticles();
  }, []);

  const handleChange = (articleId, value) => {
    setCounted(prev => ({ ...prev, [articleId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.entries(counted).map(([articleId, qty]) => ({
        articleId: parseInt(articleId),
        counted: parseInt(qty || 0)
      }));

  await axios.post('http://localhost:5000/pamoja/api/inventories/createInventory', {
        date: inventoryDate,
        zoneId: 1, // à adapter selon la zone sélectionnée ou en session
        entries: payload
      });

      alert("Inventaire enregistré avec succès");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'inventaire", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2"><ClipboardCheck /> Inventaire</h2>
        <input
          type="date"
          value={inventoryDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setInventoryDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Article</th>
            <th className="p-3 text-left">Stock théorique</th>
            <th className="p-3 text-left">Quantité physique</th>
            <th className="p-3 text-left">Ecart</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => {
            const theorique = article.stock || 0;
            const physique = counted[article.id] === '' ? '' : parseInt(counted[article.id] || 0);
            const ecart = physique === '' ? '' : physique - theorique;
            return (
              <tr key={article.id} className="border-b">
                <td className="p-3">{article.name}</td>
                <td className="p-3">{theorique}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={counted[article.id] || ''}
                    onChange={(e) => handleChange(article.id, e.target.value)}
                    className="border px-2 py-1 rounded w-24"
                  />
                </td>
                <td className="p-3">{ecart}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-6 text-right">
        {user?.role === 'ADMIN' ? (
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded">Valider l'inventaire</button>
        ) : (
          <button disabled className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed" title="Seul un administrateur peut valider l'inventaire">Valider l'inventaire</button>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
