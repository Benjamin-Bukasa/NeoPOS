const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { subDays, startOfWeek, startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

const getStats = async (req, res) => {
  try {
    const now = new Date();

    // 🔢 Articles vendus (total)
    const totalSold = await prisma.saleItem.aggregate({
      _sum: { quantity: true }
    });

    // 🏆 Article le plus vendu
    const bestSellers = await prisma.saleItem.groupBy({
      by: ['articleId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1
    });

    const bestSeller =
      bestSellers.length > 0
        ? await prisma.article.findUnique({
            where: { id: bestSellers[0].articleId },
            select: {
              id: true,
              name: true
            }
          }).then(article => ({ ...article, total: bestSellers[0]._sum.quantity }))
        : null;

    // 🟢 Ventes aujourd'hui
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySales = await prisma.saleItem.findMany({
      where: {
        sale: {
          date: {
            gte: todayStart,
            lte: todayEnd
          }
        }
      }
    });

    const todayAmount = todaySales.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // 📅 Semaine dernière
    const lastWeekStart = subDays(startOfWeek(now, { weekStartsOn: 1 }), 7);
    const lastWeekEnd = subDays(startOfWeek(now, { weekStartsOn: 1 }), 1);

    const weekSales = await prisma.saleItem.findMany({
      where: {
        sale: {
          date: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      }
    });

    const weekAmount = weekSales.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // 📆 Mois précédent
    const lastMonth = subMonths(now, 1);
    const monthStart = startOfMonth(lastMonth);
    const monthEnd = endOfMonth(lastMonth);

    const monthSales = await prisma.saleItem.findMany({
      where: {
        sale: {
          date: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      }
    });

    const monthAmount = monthSales.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // 📊 Ce mois en cours
    const thisMonthStart = startOfMonth(now);
    const thisMonthSales = await prisma.saleItem.findMany({
      where: {
        sale: {
          date: {
            gte: thisMonthStart,
            lte: now
          }
        }
      }
    });

    const currentMonthAmount = thisMonthSales.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // 📈 Ventes hebdomadaires (7 derniers jours)
    const weeklySales = await Promise.all(
      [...Array(7).keys()].map(async i => {
        const day = subDays(now, i);
        const start = new Date(day.setHours(0, 0, 0, 0));
        const end = new Date(day.setHours(23, 59, 59, 999));

        const daySales = await prisma.saleItem.findMany({
          where: {
            sale: { date: { gte: start, lte: end } }
          }
        });

        const amount = daySales.reduce((sum, s) => sum + s.unitPrice * s.quantity, 0);
        return { day: format(start, 'EEE'), amount: parseFloat(amount.toFixed(2)) };
      })
    ).then(data => data.reverse());

    // 📅 Ventes mensuelles (6 derniers mois)
    const monthlySales = await Promise.all(
      [...Array(6).keys()].map(async i => {
        const monthDate = subMonths(now, i);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);

        const monthSales = await prisma.saleItem.findMany({
          where: {
            sale: { date: { gte: start, lte: end } }
          }
        });

        const amount = monthSales.reduce((sum, s) => sum + s.unitPrice * s.quantity, 0);
        return {
          month: format(monthDate, 'MMM yyyy'),
          amount: parseFloat(amount.toFixed(2))
        };
      })
    ).then(data => data.reverse());

    // 🗓 Ventes semestrielles (par paires de mois)
    const semesterSales = [];

    for (let i = 5; i >= 0; i -= 2) {
      const start = startOfMonth(subMonths(now, i));
      const end = endOfMonth(subMonths(now, i - 1));

      const rangeSales = await prisma.saleItem.findMany({
        where: {
          sale: { date: { gte: start, lte: end } }
        }
      });

      const amount = rangeSales.reduce((sum, s) => sum + s.unitPrice * s.quantity, 0);
      semesterSales.push({
        period: `${format(start, 'MMM')}-${format(end, 'MMM')}`,
        amount: parseFloat(amount.toFixed(2))
      });
    }

    res.json({
      totalSold: totalSold._sum.quantity || 0,
      bestSeller,
      todayAmount,
      weekAmount,
      monthAmount,
      currentMonthAmount,
      weeklySales,
      monthlySales,
      semesterSales
    });
  } catch (error) {
    console.error('Erreur getStats :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getStats
};
