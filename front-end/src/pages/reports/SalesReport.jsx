
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../stores/authStore';
import axios from 'axios';
import { getCurrencySymbol } from '../../utils/currency';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

const SalesReport = () => {
  const [data, setData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastParams, setLastParams] = useState(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { user } = useAuthStore.getState();
  const [seller, setSeller] = useState(user?.role === 'SALER' ? user.id : '');
  const [category, setCategory] = useState('');
  const [sellers, setSellers] = useState([]); // [{id, name}]
  const [categories, setCategories] = useState([]);
  const currency = getCurrencySymbol();

  // On charge les vendeurs et catégories au premier chargement (pour le select)
  useEffect(() => {
    fetchData(true);
    // eslint-disable-next-line
  }, []);

  // fetchData: si initialLoad=true, ne filtre pas, sinon applique les filtres
  const fetchData = async (initialLoad = false) => {
    setLoading(true);
  if (!initialLoad) setHasSearched(true);
  try {
      const params = {};
      if (!initialLoad) {
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;
        if (user?.role === 'SALER') {
          params.sellerId = user.id;
        } else if (seller) {
          params.sellerId = seller;
        }
        if (category) params.category = category;
      }
      setLastParams(params);
      setApiError('');
      const res = await axios.get('/pamoja/api/saleArticles/report', { params });
      if (Array.isArray(res.data)) {
        setData(res.data);
        // Extraire vendeurs uniques avec id et nom
        if (user?.role !== 'SALER') {
          const uniqueSellers = [];
          const seen = new Set();
          res.data.forEach(r => {
            if (r.sellerId && r.sellerName && !seen.has(r.sellerId)) {
              uniqueSellers.push({ id: r.sellerId, name: r.sellerName });
              seen.add(r.sellerId);
            }
          });
          setSellers(uniqueSellers);
        }
        setCategories([...new Set(res.data.map(r => r.category).filter(Boolean))]);
        setApiError('');
      } else {
        setData([]);
        setApiError('Réponse inattendue de l’API');
      }
    } catch (e) {
      setData([]);
      setApiError(e?.message || 'Erreur API');
    }
    setLoading(false);
  };

  // Totaux
  const totalPurchase = data.reduce((acc, r) => acc + (r.totalPurchase || 0), 0);
  const totalSold = data.reduce((acc, r) => acc + (r.totalSold || 0), 0);
  const totalMargin = data.reduce((acc, r) => acc + (r.margin || 0), 0);

  function handleExportPDF() {
    const doc = new jsPDF();
    doc.text('Rapport de ventes', 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [[
        'Date', 'Ticket', 'Vendeur', 'Article', 'Catégorie', 'Qté',
        `Coût achat (${currency})`, `Prix vendu (${currency})`,
        `Total achat (${currency})`, `Total vendu (${currency})`, `Marge (${currency})`, 'Qté stock restant'
      ]],
      body: data.map(r => [
        r.date ? new Date(r.date).toLocaleDateString() : '',
        r.ticketNo,
        r.sellerName,
        r.articleName,
        r.category,
        r.quantity,
        r.purchasePrice?.toFixed(2),
        r.sellingPrice?.toFixed(2),
        r.totalPurchase?.toFixed(2),
        r.totalSold?.toFixed(2),
        r.margin?.toFixed(2),
        r.stockRestant ?? ''
      ]),
      foot: [[
        '', '', '', '', '', 'Totaux',
        totalPurchase.toFixed(2), totalSold.toFixed(2), totalMargin.toFixed(2), ''
      ]]
    });
    doc.save('rapport-ventes.pdf');
  }

  async function handleExportExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rapport ventes');
    worksheet.addRow([
      'Date', 'Ticket', 'Vendeur', 'Article', 'Catégorie', 'Qté',
      `Coût achat (${currency})`, `Prix vendu (${currency})`,
      `Total achat (${currency})`, `Total vendu (${currency})`, `Marge (${currency})`, 'Qté stock restant'
    ]);
    data.forEach(r => {
      worksheet.addRow([
        r.date ? new Date(r.date).toLocaleDateString() : '',
        r.ticketNo,
        r.sellerName,
        r.articleName,
        r.category,
        r.quantity,
        r.purchasePrice?.toFixed(2),
        r.sellingPrice?.toFixed(2),
        r.totalPurchase?.toFixed(2),
        r.totalSold?.toFixed(2),
        r.margin?.toFixed(2),
        r.stockRestant ?? ''
      ]);
    });
    worksheet.addRow([
      '', '', '', '', '', 'Totaux',
      totalPurchase.toFixed(2), totalSold.toFixed(2), totalMargin.toFixed(2), ''
    ]);
    worksheet.columns = [
      { width: 12 }, { width: 12 }, { width: 16 }, { width: 18 }, { width: 14 }, { width: 8 },
      { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }
    ];
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapport-ventes.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rapport de ventes</h2>
  <div className="flex flex-wrap gap-4 mb-4">
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border px-2 py-1 rounded" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border px-2 py-1 rounded" />
        {/* Select vendeur visible seulement pour ADMIN/MANAGER */}
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <select value={seller} onChange={e => setSeller(e.target.value)} className="border px-2 py-1 rounded">
            <option value="">Tous vendeurs</option>
            {sellers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
        <select value={category} onChange={e => setCategory(e.target.value)} className="border px-2 py-1 rounded">
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
  <button onClick={() => fetchData(false)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Valider</button>
      </div>
      {/* Message utilisateur si aucune donnée ou erreur, seulement après une recherche */}
      {hasSearched && !loading && (data.length === 0 || apiError) && (
        <div className="mb-2 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
          {apiError ? `Erreur lors de la récupération du rapport : ${apiError}` : "Aucune donnée pour les filtres sélectionnés."}
        </div>
      )}
      <div className="flex gap-2 mb-2">
        <button onClick={handleExportPDF} className="bg-red-200 text-red-600 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-colors">Export PDF</button>
        <button onClick={handleExportExcel} className="bg-green-200 text-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white transition-colors">Export Excel</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Ticket</th>
              <th className="p-2 border">Vendeur</th>
              <th className="p-2 border">Article</th>
              <th className="p-2 border">Catégorie</th>
              <th className="p-2 border">Qté</th>
              <th className="p-2 border">Coût achat</th>
              {/* TVA supprimée */}
              <th className="p-2 border">Prix vendu</th>
              <th className="p-2 border">Total achat</th>
              <th className="p-2 border">Total vendu</th>
              <th className="p-2 border">Marge</th>
              <th className="p-2 border">Qté stock restant</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={12} className="text-center p-4">Chargement...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={12} className="text-center p-4">Aucune donnée</td></tr>
            ) : data.map((r, i) => (
              <tr key={i}>
                <td className="p-2 border">{r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
                <td className="p-2 border">{r.ticketNo}</td>
                <td className="p-2 border">{r.sellerName}</td>
                <td className="p-2 border">{r.articleName}</td>
                <td className="p-2 border">{r.category}</td>
                <td className="p-2 border">{r.quantity}</td>
                <td className="p-2 border">{currency}{r.purchasePrice?.toFixed(2)}</td>
                {/* TVA supprimée */}
                <td className="p-2 border">{currency}{r.sellingPrice?.toFixed(2)}</td>
                <td className="p-2 border">{currency}{r.totalPurchase?.toFixed(2)}</td>
                <td className="p-2 border">{currency}{r.totalSold?.toFixed(2)}</td>
                <td className="p-2 border font-semibold">{currency}{r.margin?.toFixed(2)}</td>
                <td className="p-2 border">{r.stockRestant ?? ''}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-bold">
            <tr>
              <td colSpan={9} className="text-right p-2">Totaux</td>
              <td className="p-2 border">{currency}{totalPurchase.toFixed(2)}</td>
              <td className="p-2 border">{currency}{totalSold.toFixed(2)}</td>
              <td className="p-2 border">{currency}{totalMargin.toFixed(2)}</td>
              <td className="p-2 border"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
