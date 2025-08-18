// 📟 SalesTable avec filtres par date et vendeur, zone de filtre fixe, total et pagination en bas fixes

import React, { useEffect, useState } from 'react';
import { getCurrencySymbol } from '../utils/currency';
import api from '../utils/api';
import { useUserStore } from '../stores/useUserStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import Modal from './SaleDetailModal';
import SaleEditModal from './SaleEditModal';
import { Search, User, Package, PercentCircle, Euro, FileDown, FileSpreadsheet,Eye,FilePenLine,Trash2 } from 'lucide-react';
import { MoreVertical } from 'lucide-react';


const SalesTable = () => {
  const { user } = useUserStore();

  const [sales, setSales] = useState([]);
  const [ticketSales, setTicketSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editSale, setEditSale] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [sellers, setSellers] = useState([]);
  const [sellerFilter, setSellerFilter] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, saleId: null });


  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get('/pamoja/api/saleArticles/getAllSales');
        let filtered = response.data;
        // Si SALER, ne voir que ses propres ventes
        if (user?.role === 'SALER') {
          filtered = filtered.filter(sale => sale.sellerId === user.id || sale.sellerName === user.name);
        }
        setSales(filtered);
        // Regrouper par ticketNo
        const tickets = {};
        filtered.forEach(sale => {
          if (!tickets[sale.ticketNo]) tickets[sale.ticketNo] = [];
          tickets[sale.ticketNo].push(sale);
        });
        setTicketSales(Object.values(tickets));
        const uniqueSellers = [...new Set(filtered.map(sale => sale.sellerName))];
        setSellers(uniqueSellers);
      } catch (error) {
        console.error('Erreur lors du chargement des ventes', error);
      }
    };
    fetchSales();
  }, [user]);

  const confirmDelete = (id) => {
    setDeleteConfirm({ show: true, saleId: id });
  };

  const handleDelete = async () => {
    try {
  await api.delete(`/pamoja/api/saleArticles/deleteSale/${deleteConfirm.saleId}`);
      setSales(prev => prev.filter(s => s.id !== deleteConfirm.saleId));
    } catch (error) {
      console.error('Erreur suppression vente', error);
    } finally {
      setDeleteConfirm({ show: false, saleId: null });
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.articleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? sale.status === statusFilter : true;
    const matchesPrice = priceFilter ? sale.price <= parseFloat(priceFilter) : true;
    const matchesSeller = sellerFilter ? sale.sellerName === sellerFilter : true;
    const saleDate = new Date(sale.date).toISOString().slice(0, 10);
    const matchesDate = saleDate >= startDate && saleDate <= endDate;
    return matchesSearch && matchesStatus && matchesPrice && matchesSeller && matchesDate;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const totalAmountCurrentPage = currentItems.reduce((acc, sale) => acc + (sale.price * sale.quantitySold), 0);

  // Grouper les ventes par article pour l'export
  const getGroupedSales = () => {
    const grouped = {};
    filteredSales.forEach(sale => {
      if (!grouped[sale.articleName]) {
        grouped[sale.articleName] = {
          articleName: sale.articleName,
          quantitySold: 0,
          stock: sale.stock,
          price: sale.price,
          total: 0,
        };
      }
      grouped[sale.articleName].quantitySold += sale.quantitySold;
      grouped[sale.articleName].total += sale.price * sale.quantitySold;
    });
    return Object.values(grouped);
  };

  const currency = getCurrencySymbol();
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Liste des ventes (regroupées par article)', 14, 16);
    const grouped = getGroupedSales();
    const totalGeneral = grouped.reduce((acc, s) => acc + s.total, 0);
    autoTable(doc, {
      startY: 20,
      head: [[`Article`, `Qté totale`, `Stock`, `Prix (${currency})`, `Total (${currency})`]],
      body: [
        ...grouped.map(sale => [
          sale.articleName,
          sale.quantitySold,
          sale.stock,
          sale.price.toFixed(2),
          sale.total.toFixed(2)
        ]),
        [
          'TOTAL',
          grouped.reduce((acc, s) => acc + s.quantitySold, 0),
          '',
          '',
          totalGeneral.toFixed(2)
        ]
      ]
    });
    doc.save('ventes.pdf');
  };

  const handleExportExcel = async () => {
    const grouped = getGroupedSales();
    const totalGeneral = grouped.reduce((acc, s) => acc + s.total, 0);
    const sellersList = Array.from(new Set(filteredSales.map(s => s.sellerName))).join(', ');
    const period = `Période : ${startDate} au ${endDate}`;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventes');

    // En-têtes
  worksheet.addRow([`Article`, `Qté totale`, `Stock`, `Prix (${currency})`, `Total (${currency})`]);
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' }
    };

    // Données
    grouped.forEach(sale => {
      worksheet.addRow([
        sale.articleName,
        sale.quantitySold,
        sale.stock,
        sale.price,
        sale.total
      ]);
    });
    // Ligne total
    worksheet.addRow([
      'TOTAL',
      grouped.reduce((acc, s) => acc + s.quantitySold, 0),
      '',
      '',
      totalGeneral
    ]);
    const totalRow = worksheet.lastRow;
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFDE68A' }
    };

    // Ligne vide
    worksheet.addRow([]);
    // Infos vendeurs/période
    worksheet.addRow(['Vendeurs', sellersList]);
    worksheet.addRow(['Période', period]);

    // Style des bordures et largeur
    worksheet.columns = [
      { width: 30 },
      { width: 15 },
      { width: 10 },
      { width: 12 },
      { width: 15 }
    ];
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF2563EB' } },
          left: { style: 'thin', color: { argb: 'FF2563EB' } },
          bottom: { style: 'thin', color: { argb: 'FF2563EB' } },
          right: { style: 'thin', color: { argb: 'FF2563EB' } }
        };
        if (rowNumber > 1 && rowNumber <= grouped.length + 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: rowNumber % 2 === 0 ? 'FFF1F5F9' : 'FFFFFFFF' }
          };
        }
      });
    });

    // Générer le fichier
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventes.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="relative bg-white rounded-xl shadow h-[calc(100vh-100px)] flex flex-col overflow-hidden scrollbar-hide z-[1]">
      {/* Zone de filtres */}
      <div className="sticky top-0 bg-white p-4 border-b flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center p-2 gap-2 w-full md:w-1/4 border">
          <Search className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Rechercher un article..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-3 py-2 rounded w-full outline-none border-none"/>
        </div>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-2 rounded outline-none" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-2 rounded" />
        <select value={sellerFilter} onChange={(e) => setSellerFilter(e.target.value)} className="border px-3 py-2 rounded outline-none">
          <option value="">Tous les vendeurs</option>
          {sellers.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border px-3 py-2 rounded outline-none">
          <option value="">Tous les statuts</option>
          <option value="NORMAL">Normal</option>
          <option value="DISCOUNTED">Réduit</option>
        </select>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="border px-3 py-2 rounded outline-none">
          <option value="">Tous les prix</option>
          <option value="50">≤ 50{currency}</option>
          <option value="100">≤ 100{currency}</option>
        </select>
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))} className="border px-3 py-2 rounded outline-none">
          <option value={5}>5 lignes</option>
          <option value={8}>8 lignes</option>
          <option value={10}>10 lignes</option>
          <option value={20}>20 lignes</option>
        </select>
        <div className="flex gap-2 ml-auto">
          <button onClick={handleExportPDF} className="bg-red-200 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2">
            <FileDown className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="bg-green-200 text-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-left">
              {/* <th className="p-3 font-semibold">Image</th> */}
              <th className="p-3 font-semibold">Article</th>
              <th className="p-3 font-semibold">Qté</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Prix</th>
              <th className="p-3 font-semibold">Prix Total</th>
              <th className="p-3 font-semibold">Ticket</th>
              <th className="p-3 font-semibold">Vendeur</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {ticketSales.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage).map((ticket, idx) => {
              const first = ticket[0];
              const total = ticket.reduce((acc, s) => acc + s.price * s.quantitySold, 0);
              return (
                <tr key={first.ticketNo} className="border-b hover:bg-gray-50">
                  {/* <td className="p-3">{first.image ? (<img src={first.image} alt={first.articleName} className="w-10 h-10 object-cover rounded" />) : (<span className="text-gray-400">N/A</span>)}</td> */}
                  <td className="p-3 font-medium text-gray-800">Ticket #{first.ticketNo}</td>
                  <td className="p-3">{ticket.reduce((acc, s) => acc + s.quantitySold, 0)}</td>
                  <td className="p-3">-</td>
                  <td className="p-3">-</td>
                  <td className="p-3">{currency}{total.toFixed(2)}</td>
                  <td className="p-3 text-gray-600">{first.ticketNo}</td>
                  <td className="p-3 text-gray-600">{first.sellerName}</td>
                  <td className="p-3 space-x-1 flex items-center gap-6">
                    <button onClick={() => setSelectedSale(ticket)} className="text-gray-600 hover:text-red-500 hover:underline"><Eye/></button>
                    {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                      <>
                        <button onClick={() => setEditSale(ticket)} className="text-gray-600 hover:text-blue-500 hover:underline">
                          <FilePenLine/>
                        </button>
                        <button onClick={() => confirmDelete(first.id)} className="text-gray-600 hover:text-red-500 hover:underline">
                          <Trash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {currentItems.length > 0 && (
              <tr className="bg-gray-100 font-semibold sticky bottom-12">
                <td colSpan="4" className="p-3 text-right">Total page</td>
                <td className="p-3"></td>
                <td className="p-3">{currency}{totalAmountCurrentPage.toFixed(2)}</td>
                <td colSpan="4" className="p-3 text-right"></td>
                <td colSpan="3"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-0 bg-white border-t px-4 py-2 flex justify-between items-center z-10">
        <p className="text-sm text-gray-500">Page {currentPage} sur {totalPages}</p>
        <div className="space-x-2">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={currentPage === 1}>Précédent</button>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="px-3 py-1 border rounded disabled:opacity-50" disabled={currentPage === totalPages}>Suivant</button>
        </div>
      </div>

      {selectedSale && Array.isArray(selectedSale) && (
        <Modal ticket={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
      {editSale && Array.isArray(editSale) && (user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
        <SaleEditModal
          ticket={editSale}
          onClose={() => setEditSale(null)}
          onSave={updatedSales => {
            setSales(prev => prev.map(s => {
              const updated = updatedSales.find(us => us.id === s.id);
              return updated ? updated : s;
            }));
          }}
        />
      )}

      {deleteConfirm.show && (
        <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded shadow-xl text-center">
            <p className="mb-4 text-lg">Voulez-vous vraiment supprimer cette vente ?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeleteConfirm({ show: false, saleId: null })} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;
