import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text(`Ticket #${items[0]?.ticketNo || ''}`, 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [['Article', 'Qté', 'Prix (€)', 'Total (€)']],
      body: items.map(item => [
        item.articleName,
        item.quantitySold,
        item.price.toFixed(2),
        (item.price * item.quantitySold).toFixed(2)
      ])
    });
    const total = items.reduce((acc, i) => acc + i.price * i.quantitySold, 0);
    doc.text(`Total: €${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    // Ouvrir dans un nouvel onglet et lancer l'impression
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
      };
    }
  };
import React, { useState } from "react";
import api from "../utils/api";



const SaleEditModal = ({ ticket, onClose, onSave }) => {
  const [items, setItems] = useState(ticket.map(sale => ({ ...sale })));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (idx, field, value) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updated = [];
      for (let i = 0; i < items.length; i++) {
        const sale = items[i];
        await api.put(`/pamoja/api/saleArticles/updateSaleItem/${sale.saleItemId || sale.id}`, {
          quantitySold: sale.quantitySold,
          price: sale.price,
          status: sale.status || "NORMAL",
        });
        updated.push(sale);
      }
      onSave && onSave(updated);
      onClose();
    } catch {
      setError("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text(`Ticket #${items[0]?.ticketNo || ''}`, 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [['Article', 'Qté', 'Prix (€)', 'Total (€)']],
      body: items.map(item => [
        item.articleName,
        item.quantitySold,
        item.price.toFixed(2),
        (item.price * item.quantitySold).toFixed(2)
      ])
    });
    const total = items.reduce((acc, i) => acc + i.price * i.quantitySold, 0);
    doc.text(`Total: €${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`ticket_${items[0]?.ticketNo || ''}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Modifier le ticket</h2>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Article</th>
              <th className="p-2 text-right">Qté</th>
              <th className="p-2 text-right">Prix</th>
              <th className="p-2 text-right">Statut</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td className="p-2">{item.articleName}</td>
                <td className="p-2 text-right">
                  <input type="number" min={1} value={item.quantitySold} onChange={e => handleChange(idx, 'quantitySold', Number(e.target.value))} className="w-16 border px-2 py-1 rounded" required />
                </td>
                <td className="p-2 text-right">
                  <input type="number" min={0} step={0.01} value={item.price} onChange={e => handleChange(idx, 'price', Number(e.target.value))} className="w-20 border px-2 py-1 rounded" required />
                </td>
                <td className="p-2 text-right">
                  <select value={item.status || "NORMAL"} onChange={e => handleChange(idx, 'status', e.target.value)} className="border px-2 py-1 rounded">
                    <option value="NORMAL">Normal</option>
                    <option value="DISCOUNTED">Réduit</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-between items-center gap-2 mt-4">
          <button type="button" onClick={handlePrint} className="px-4 py-2 bg-green-600 text-white rounded">Imprimer le ticket</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SaleEditModal;
