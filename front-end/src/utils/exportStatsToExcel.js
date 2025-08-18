import { utils, writeFile } from 'xlsx';

export function exportStatsToExcel(stats, periodLabel) {
  // Prepare data for each table
  const summary = [
    ['Total articles vendus', stats.totalSold],
    ['Meilleur article', stats.bestSeller ? `${stats.bestSeller.name} (${stats.bestSeller.total})` : 'Aucun'],
    ["Ventes aujourd'hui", stats.todayAmount],
    ['Ventes semaine dernière', stats.weekAmount],
    ['Ventes mois précédent', stats.monthAmount],
    ['Ventes ce mois', stats.currentMonthAmount],
  ];

  const weekly = [
    ['Jour', ...stats.weeklySales.map(d => d.day)],
    ['Montant', ...stats.weeklySales.map(d => d.amount)],
  ];

  const monthly = [
    ['Mois', ...stats.monthlySales.map(m => m.month)],
    ['Montant', ...stats.monthlySales.map(m => m.amount)],
  ];

  const semester = [
    ['Période', ...stats.semesterSales.map(s => s.period)],
    ['Montant', ...stats.semesterSales.map(s => s.amount)],
  ];

  // Create sheets
  const wb = utils.book_new();
  utils.book_append_sheet(wb, utils.aoa_to_sheet(summary), 'Résumé');
  utils.book_append_sheet(wb, utils.aoa_to_sheet(weekly), '7 derniers jours');
  utils.book_append_sheet(wb, utils.aoa_to_sheet(monthly), '6 derniers mois');
  utils.book_append_sheet(wb, utils.aoa_to_sheet(semester), 'Semestriel');

  writeFile(wb, `Statistiques_ventes_${periodLabel}.xlsx`);
}
