import React, { useEffect, useState } from 'react';
import InventoryEditModal from './InventoryEditModal';
import { Edit, Trash2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const InventoryList = () => {
  const [inventories, setInventories] = useState([]);
  const [editInv, setEditInv] = useState(null);
  const [notif, setNotif] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/pamoja/api/inventories/getAllInventories')
      .then(res => setInventories(res.data))
      .catch(() => setInventories([]));
  }, []);


  const exportPDF = (inv) => {
    const doc = new jsPDF();
    doc.text(`Inventaire du ${new Date(inv.date).toLocaleDateString()}`, 14, 16);
    doc.text(`Zone: ${inv.zoneName || ''}`, 14, 24);
    doc.text(`Utilisateur: ${inv.userName || ''}`, 14, 32);
    doc.autoTable({
      startY: 40,
      head: [['Article', 'Quantité comptée']],
      body: (inv.entries || []).map(e => [e.article?.name || '', e.counted])
    });
    doc.save(`inventaire_${inv.id}.pdf`);
    setNotif('PDF téléchargé avec succès !');
    setTimeout(() => setNotif(""), 2500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet inventaire ?')) return;
    try {
      await axios.delete(`http://localhost:5000/pamoja/api/inventories/deleteInventory/${id}`);
      setInventories(inv => inv.filter(i => i.id !== id));
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (id) => {
    const inv = inventories.find(i => i.id === id);
    if (inv) setEditInv(inv);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      {notif && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50 animate-pulse">
          {notif}
        </div>
      )}
      {editInv && (
        <InventoryEditModal
          inventory={editInv}
          onClose={() => setEditInv(null)}
          onSaved={() => {
            // Refresh list after edit
            axios.get('http://localhost:5000/pamoja/api/inventories/getAllInventories')
              .then(res => setInventories(res.data))
              .catch(() => setInventories([]));
          }}
        />
      )}
      <h3 className="text-lg font-bold mb-4">Liste des inventaires</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Zone</th>
            <th className="p-2 border">Articles comptés</th>
            <th className="p-2 border">Utilisateur</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventories.length > 0 ? inventories.map(inv => (
            <tr key={inv.id}>
              <td className="p-2 border">{new Date(inv.date).toLocaleDateString()}</td>
              <td className="p-2 border">{inv.zoneName || ''}</td>
              <td className="p-2 border">{inv.entries?.length || 0}</td>
              <td className="p-2 border">{inv.userName || ''}</td>
              <td className="p-2 border">
                <div className="flex gap-2">
                  <button
                    onClick={() => exportPDF(inv)}
                    title="Exporter"
                    className="text-black hover:text-blue-600 transition-colors"
                  >
                    <FileText size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(inv.id)}
                    title="Éditer"
                    className="text-black hover:text-yellow-500 transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    title="Supprimer"
                    className="text-black hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={5} className="text-center">Aucun inventaire</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
