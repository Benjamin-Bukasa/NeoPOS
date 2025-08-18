const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /pamoja/api/stock-alerts
router.get('/', async (req, res) => {
  try {
    // Récupérer tous les articles
    const allArticles = await prisma.article.findMany({
      include: {
        stocks: true
      }
    });
    // Filtrer ceux qui n'ont pas de stock OU dont tous les stocks sont <= 0
    const articlesOutOfStock = allArticles.filter(article =>
      article.stocks.length === 0 || article.stocks.every(s => s.quantity <= 0)
    );
    res.json({ count: articlesOutOfStock.length, articles: articlesOutOfStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
