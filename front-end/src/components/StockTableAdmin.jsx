// StockTableAdmin.jsx
import ModifyStockModal from './ModifyStockModal';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';
import { PlusCircle, Pencil, Warehouse, FilePenLine, Trash2 } from 'lucide-react';
import Modal from './StockMovementModal';
import ArticleEditModal from './ArticleEditModal';

const StockTableAdmin = () => {
  const { user } = useUserStore();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [editArticleModalOpen, setEditArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/pamoja/api/stocks/getStocks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStocks(response.data);
    } catch (error) {
      console.error("Erreur de chargement du stock", error);
    }
  };

  useEffect(() => {
    fetchStocks();
    // Récupération des articles et zones pour la table
  }, []);

  const openMovementModal = (stock) => {
    setSelectedStock(stock);
    setMovementModalOpen(true);
  };

  const openModifyModal = (stock) => {
    if (!stock.id) return; // pas de ligne à modifier si stock inexistant
    setSelectedStock(stock);
    setModifyModalOpen(true);
  };

  const openEditArticleModal = (article) => {
    setSelectedArticle(article);
    setEditArticleModalOpen(true);
  };

  const handleDeleteStock = async (stockId) => {
    if (!stockId) return; // rien à supprimer
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stock ?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/pamoja/api/stocks/deleteStock/${stockId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchStocks();
      } catch (error) {
        console.error("Erreur lors de la suppression du stock", error);
        alert("Erreur lors de la suppression du stock");
      }
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow h-[calc(100vh-100px)] flex flex-col overflow-hidden z-[1]">
      <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between z-10">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><Warehouse /> Gestion du Stock</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-left">
              <th className="p-3 font-semibold">Article</th>
              <th className="p-3 font-semibold">Zone</th>
              <th className="p-3 font-semibold">Quantité</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const rowKey = `${stock.article?.id}-${stock.zone?.id}`;
              const isPersisted = Boolean(stock.id); // ligne stock existe en DB ?
              return (
                <tr key={rowKey} className="border-b hover:bg-gray-50">
                  <td className="p-3">{stock.article?.name}</td>
                  <td className="p-3">{stock.zone?.name}</td>
                  <td className="p-3">{stock.quantity}</td>
                  <td className="p-3">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => openMovementModal(stock)}
                        className="text-green-600 hover:bg-green-100 p-2 rounded-full transition-colors"
                        title="Entrée/Sortie Stock"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>

                      {user?.role === 'ADMIN' && (
                        <>
                          {/* Modifier uniquement si la ligne existe (id non nul) */}
                          <button
                            onClick={() => openModifyModal(stock)}
                            disabled={!isPersisted}
                            className={`p-2 rounded-full transition-colors ${isPersisted ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 cursor-not-allowed'}`}
                            title={isPersisted ? 'Modifier Stock' : "Aucune ligne de stock à modifier"}
                          >
                            <Pencil className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => openEditArticleModal(stock.article)}
                            className="text-orange-600 hover:bg-orange-100 p-2 rounded-full transition-colors"
                            title="Modifier Article"
                          >
                            <FilePenLine className="w-5 h-5" />
                          </button>

                          {/* Supprimer uniquement si la ligne existe */}
                          <button
                            className={`p-2 rounded-full transition-colors ${isPersisted ? 'text-red-600 hover:bg-red-100' : 'text-gray-400 cursor-not-allowed'}`}
                            title={isPersisted ? 'Supprimer' : "Aucune ligne de stock à supprimer"}
                            onClick={() => isPersisted && handleDeleteStock(stock.id)}
                            disabled={!isPersisted}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {movementModalOpen && (
        <Modal
          stock={selectedStock}
          onClose={() => { setMovementModalOpen(false); fetchStocks(); }}
        />
      )}

      {modifyModalOpen && (
        <ModifyStockModal
          stock={selectedStock}
          onClose={() => { setModifyModalOpen(false); fetchStocks(); }}
        />
      )}

      {editArticleModalOpen && selectedArticle && (
        <ArticleEditModal
          article={selectedArticle}
          onClose={() => setEditArticleModalOpen(false)}
          onSaved={fetchStocks}
        />
      )}
    </div>
  );
};

export default StockTableAdmin;
