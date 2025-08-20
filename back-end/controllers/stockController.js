// controllers/stockController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createStock = async (req, res) => {
  try {
    const { articleId, zoneId, quantity } = req.body;
    const aId = parseInt(articleId);
    const zId = parseInt(zoneId);
    const qty = parseInt(quantity ?? 0);

    if (isNaN(aId) || isNaN(zId) || isNaN(qty)) {
      return res.status(400).json({ error: 'Valeurs invalides' });
    }

    const stock = await prisma.stock.upsert({
      where: { articleId_zoneId: { articleId: aId, zoneId: zId } },
      update: { quantity: qty },
      create: { articleId: aId, zoneId: zId, quantity: qty }
    });

    res.status(201).json(stock);
  } catch (error) {
    console.error('Erreur lors de la création du stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const stockId = parseInt(id);
    const qty = parseInt(quantity);

    if (isNaN(stockId) || isNaN(qty)) {
      return res.status(400).json({ error: 'Valeurs invalides' });
    }

    const stock = await prisma.stock.update({
      where: { id: stockId },
      data: { quantity: qty }
    });

    res.status(200).json(stock);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Renvoie une grille Article x Zone :
 *  - si une ligne Stock existe -> renvoie son id et sa quantité
 *  - sinon -> id = null, quantité = 0 (mais zoneId réel => mouvements possibles)
 */
const getStocks = async (req, res) => {
  try {
    const [articles, zones, stocks] = await Promise.all([
      prisma.article.findMany({ select: { id: true, name: true } }),
      prisma.storageZone.findMany({ select: { id: true, name: true } }),
      prisma.stock.findMany({
        include: {
          article: { select: { id: true, name: true } },
          zone: { select: { id: true, name: true } }
        }
      })
    ]);

    // Map: "articleId-zoneId" -> stock
    const existing = new Map();
    for (const s of stocks) {
      existing.set(`${s.articleId}-${s.zoneId}`, s);
    }

    const rows = [];
    for (const a of articles) {
      for (const z of zones) {
        const key = `${a.id}-${z.id}`;
        if (existing.has(key)) {
          const s = existing.get(key);
          rows.push({
            id: s.id,
            article: { id: a.id, name: a.name },
            zone: { id: z.id, name: z.name },
            quantity: s.quantity
          });
        } else {
          rows.push({
            id: null,
            article: { id: a.id, name: a.name },
            zone: { id: z.id, name: z.name },
            quantity: 0
          });
        }
      }
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des stocks :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stockId = parseInt(id);
    if (isNaN(stockId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    await prisma.stock.delete({ where: { id: stockId } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  createStock,
  updateStock,
  getStocks,
  deleteStock
};
