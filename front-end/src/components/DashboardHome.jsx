// 🏠 DashboardHome : Vue d'accueil avec statistiques et graphiques avec labels

import React, { useEffect, useState } from 'react';
import { getCurrencySymbol } from '../utils/currency';
import axios from 'axios';
import { DollarSign, PackageCheck, ShoppingCart, Trophy } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl shadow-md ${color} text-white`}>
    <div className="p-2 bg-white bg-opacity-20 rounded-full">
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, data, dataKeyX, dataKeyY, color, xLabel, yLabel }) => (
  <div className="bg-white rounded-xl shadow p-4 w-full">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKeyX}>
          <Label value={xLabel} offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label
            angle={-90}
            value={yLabel}
            position="insideLeft"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip />
        <Bar dataKey={dataKeyY} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalSold: 0,
    bestSeller: null,
    todayAmount: 0,
    weekAmount: 0,
    monthAmount: 0,
    currentMonthAmount: 0,
    weeklySales: [],
    monthlySales: [],
    semesterSales: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/pamoja/api/salesStats/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Erreur chargement statistiques', err);
      }
    };
    fetchStats();
  }, []);

  const currency = getCurrencySymbol();
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Tableau de bord</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Articles vendus"
          value={stats.totalSold}
          icon={ShoppingCart}
          color="bg-indigo-600"
        />
        <StatCard
          title="Meilleur article"
          value={stats.bestSeller ? `${stats.bestSeller.name} (${stats.bestSeller.total})` : 'Aucun'}
          icon={Trophy}
          color="bg-yellow-600"
        />
        <StatCard
          title="Ventes aujourd'hui"
          value={`${currency}${stats.todayAmount.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-600"
        />
        <StatCard
          title="Ventes semaine dernière"
          value={`${currency}${stats.weekAmount.toFixed(2)}`}
          icon={DollarSign}
          color="bg-blue-600"
        />
        <StatCard
          title="Ventes mois passé"
          value={`${currency}${stats.monthAmount.toFixed(2)}`}
          icon={DollarSign}
          color="bg-blue-600"
        />
        <StatCard
          title="Ventes ce mois-ci"
          value={`€${stats.currentMonthAmount.toFixed(2)}`}
          icon={DollarSign}
          color="bg-purple-600"
        />
      </div>

      {/* Zone de graphiques supérieure : Hebdo + Mensuel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="🗕️ Hebdomadaire"
          data={stats.weeklySales}
          dataKeyX="day"
          dataKeyY="amount"
          xLabel="Jours"
          yLabel="Montant €"
          color="#4f46e5"
        />
        <ChartCard
          title="🗓️ Mensuel"
          data={stats.monthlySales}
          dataKeyX="month"
          dataKeyY="amount"
          xLabel="Mois"
          yLabel="Montant €"
          color="#16a34a"
        />
      </div>

      {/* Graphique semestriel seul */}
      <div>
        <ChartCard
          title="📆 Semestriel"
          data={stats.semesterSales}
          dataKeyX="period"
          dataKeyY="amount"
          xLabel="Période"
          yLabel="Montant €"
          color="#e11d48"
        />
      </div>
    </div>
  );
};

export default DashboardHome;
