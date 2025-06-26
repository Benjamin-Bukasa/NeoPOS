import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Modal from './SaleDetailModal';

const SalesTable = () => {
  const { user } = useUserStore();
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pamoja/api/saleArticles/getAllSales');
        setSales(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des ventes', error);
      }
    };

    fetchSales();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await axios.delete(`http://localhost:5000/pamoja/api/saleArticles/deleteSale/${id}`);
      setSales(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Erreur suppression vente', error);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.articleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? sale.status === statusFilter : true;
    const matchesPrice = priceFilter ? sale.price <= parseFloat(priceFilter) : true;
    return matchesSearch && matchesStatus && matchesPrice;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const totalAmountCurrentPage = currentItems.reduce((acc, sale) => acc + (sale.price * sale.quantitySold), 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Liste des ventes', 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [['Article', 'Qté', 'Stock', 'Prix (€)', 'Ticket', 'Vendeur']],
      body: filteredSales.map(sale => [
        sale.articleName,
        sale.quantitySold,
        sale.stock,
        sale.price.toFixed(2),
        sale.ticketNo,
        sale.sellerName
      ])
    });
    doc.save('ventes.pdf');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSales.map(sale => ({
      Article: sale.articleName,
      Quantite: sale.quantitySold,
      Stock: sale.stock,
      Prix: sale.price,
      Ticket: sale.ticketNo,
      Vendeur: sale.sellerName
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventes');
    XLSX.writeFile(workbook, 'ventes.xlsx');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="🔍 Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">📦 Tous les statuts</option>
          <option value="NORMAL">✅ Normal</option>
          <option value="DISCOUNTED">🔻 Réduit</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">💰 Tous les prix</option>
          <option value="50">≤ 50€</option>
          <option value="100">≤ 100€</option>
        </select>

        <div className="flex gap-2 ml-auto">
          <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">📄 Export PDF</button>
          <button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">📊 Export Excel</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Article</th>
              <th className="p-3 font-semibold">Qté</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Prix</th>
              <th className="p-3 font-semibold">Ticket</th>
              <th className="p-3 font-semibold">Vendeur</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sale, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {sale.image ? (
                    <img src={sale.image} alt={sale.articleName} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-3 font-medium text-gray-800">{sale.articleName}</td>
                <td className="p-3">{sale.quantitySold}</td>
                <td className="p-3">{sale.stock}</td>
                <td className="p-3">€{sale.price.toFixed(2)}</td>
                <td className="p-3 text-gray-600">{sale.ticketNo}</td>
                <td className="p-3 text-gray-600">{sale.sellerName}</td>
                <td className="p-3 space-x-1">
                  <button onClick={() => setSelectedSale(sale)} className="text-blue-600 hover:underline">Voir</button>
                  {user?.role === 'ADMIN' && (
                    <>
                      <button className="text-yellow-600 hover:underline">Modifier</button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {currentItems.length > 0 && (
              <tr className="bg-gray-100 font-semibold">
                <td colSpan="4" className="p-3 text-right">Total page</td>
                <td className="p-3">€{totalAmountCurrentPage.toFixed(2)}</td>
                <td colSpan="3"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Page {currentPage} sur {totalPages}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            ⬅️ Précédent
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Suivant ➡️
          </button>
        </div>
      </div>

      {selectedSale && (
        <Modal sale={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
    </div>
  );
};

export default SalesTable;
