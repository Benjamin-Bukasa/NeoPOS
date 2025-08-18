
import React, { useEffect, useState } from 'react';
import { getCurrencySymbol } from '../utils/currency';
import axios from 'axios';
import { exportStatsToExcel } from '../utils/exportStatsToExcel';


const SaleStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all');
  const [periodLabel, setPeriodLabel] = useState('toutes');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For demo, period filter is not sent to backend, but could be added
        const response = await axios.get('http://localhost:5000/pamoja/api/salesStats/stats');
        setStats(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    if (stats) exportStatsToExcel(stats, periodLabel);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    if (e.target.value === 'custom') {
      setPeriodLabel(`${dateFrom || '...'}_au_${dateTo || '...'}`);
    } else {
      setPeriodLabel(e.target.options[e.target.selectedIndex].text);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Statistiques des ventes</h2>

      {/* Filtres de période */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <label className="font-medium">Période :</label>
        <select value={period} onChange={handlePeriodChange} className="border px-3 py-2 rounded">
          <option value="all">Toutes</option>
          <option value="week">7 derniers jours</option>
          <option value="month">6 derniers mois</option>
          <option value="semester">Semestriel</option>
          <option value="custom">Personnalisée</option>
        </select>
        {period === 'custom' && (
          <>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border px-2 py-1 rounded" />
            <span>au</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border px-2 py-1 rounded" />
          </>
        )}
        <button onClick={handleExport} className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Exporter Excel</button>
      </div>

      {/* Tableau résumé */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Indicateur</th>
              <th className="p-3 border text-left">Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-3 border">Total articles vendus</td><td className="p-3 border">{stats.totalSold}</td></tr>
            <tr><td className="p-3 border">Meilleur article</td><td className="p-3 border">{stats.bestSeller ? `${stats.bestSeller.name} (${stats.bestSeller.total})` : 'Aucun'}</td></tr>
            <tr><td className="p-3 border">Ventes aujourd'hui</td><td className="p-3 border">{stats.todayAmount} {getCurrencySymbol()}</td></tr>
            <tr><td className="p-3 border">Ventes semaine dernière</td><td className="p-3 border">{stats.weekAmount} {getCurrencySymbol()}</td></tr>
            <tr><td className="p-3 border">Ventes mois précédent</td><td className="p-3 border">{stats.monthAmount} {getCurrencySymbol()}</td></tr>
            <tr><td className="p-3 border">Ventes ce mois</td><td className="p-3 border">{stats.currentMonthAmount} {getCurrencySymbol()}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Tableau croisé dynamique : 7 derniers jours */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Ventes des 7 derniers jours</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {stats.weeklySales.map((d, i) => (
                  <th key={i} className="p-3 border text-center">{d.day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {stats.weeklySales.map((d, i) => (
                  <td key={i} className="p-3 border text-center font-semibold">{d.amount} {getCurrencySymbol()}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tableau croisé dynamique : 6 derniers mois */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Ventes des 6 derniers mois</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {stats.monthlySales.map((m, i) => (
                  <th key={i} className="p-3 border text-center">{m.month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {stats.monthlySales.map((m, i) => (
                  <td key={i} className="p-3 border text-center font-semibold">{m.amount} {getCurrencySymbol()}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tableau croisé dynamique : Semestriel (paires de mois) */}
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Ventes semestrielles (paires de mois)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {stats.semesterSales.map((s, i) => (
                  <th key={i} className="p-3 border text-center">{s.period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {stats.semesterSales.map((s, i) => (
                  <td key={i} className="p-3 border text-center font-semibold">{s.amount} {getCurrencySymbol()}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SaleStatistics;
