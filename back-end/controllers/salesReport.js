// controllers/getSalesReport.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /pamoja/api/saleArticles/report?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD&sellerId=...&category=...
const getSalesReport = async (req, res) => {
  try {
    const { dateFrom, dateTo, sellerId, category } = req.query;
    const where = {};

    if (dateFrom && dateTo) {
      where.date = {
        gte: new Date(dateFrom + 'T00:00:00'),
        lte: new Date(dateTo + 'T23:59:59'),
      };
    }

    if (sellerId) {
      where.sellerId = parseInt(sellerId);
    }

    // Récupère toutes les ventes
    const sales = await prisma.sale.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            article: { include: { subCategory: true } }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const articleIds = Array.from(new Set(
      sales.flatMap(sale => sale.items.map(item => item.articleId))
    ));

    let allMovements = [];
    let allSalesItems = [];
    if (articleIds.length > 0) {
      allMovements = await prisma.stockMovement.findMany({
        where: { articleId: { in: articleIds } },
        orderBy: { date: 'asc' }
      });

      allSalesItems = await prisma.saleItem.findMany({
        where: { articleId: { in: articleIds } },
        include: { sale: true },
        orderBy: { sale: { date: 'asc' } }
      });
    }

    const getStockAtDate = (articleId, date) => {
      if (!articleId || !date) return null;
      let stock = 0;

      allMovements.forEach(mov => {
        if (mov.articleId === articleId && mov.date <= date) {
          stock += mov.type === 'ENTRY' ? mov.quantity : -mov.quantity;
        }
      });

      allSalesItems.forEach(si => {
        if (si.articleId === articleId && si.sale.date <= date) {
          stock -= si.quantity;
        }
      });

      return stock;
    };

    const param = await prisma.parameter.findFirst();
    const tva = param?.tva || 0;

    const report = sales.flatMap(sale =>
      sale.items.map(item => {
        const stockRestant = getStockAtDate(item.articleId, sale.date);
        return {
          saleId: sale.id,
          ticketNo: sale.ticketNo,
          date: sale.date,
          sellerId: sale.userId,
          sellerName: sale.user?.name || '',
          articleName: item.article?.name || '',
          category: item.article?.subCategory?.name || '',
          purchasePrice: item.article?.purchasePrice || 0,
          sellingPrice: item.unitPrice,
          quantity: item.quantity,
          tva,
          totalPurchase: (item.article?.purchasePrice || 0) * item.quantity,
          totalSold: item.unitPrice * item.quantity,
          margin: (item.unitPrice - (item.article?.purchasePrice || 0)) * item.quantity,
          stockRestant
        };
      })
    );

    const filtered = category ? report.filter(r => r.category === category) : report;
    const response = Array.isArray(filtered) ? filtered : [];

    console.log("📊 Rapport envoyé au front:", response.length, "lignes");
    res.json(response);

  } catch (error) {
    console.error('❌ Erreur getSalesReport:', error);
    res.status(500).json([]);
  }
};

module.exports = {
  getSalesReport
};
