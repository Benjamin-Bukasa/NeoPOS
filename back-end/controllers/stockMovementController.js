// controllers/stockMovementController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un mouvement de stock (entrée ou sortie)
const createStockMovement = async (req, res) => {
  try {
    const { articleId, zoneId, quantity, type, reason } = req.body;

    const aId = parseInt(articleId);
    const zId = parseInt(zoneId);
    const qty = parseInt(quantity);

    if (!aId || !zId || !qty || !type) {
      return res.status(400).json({ error: 'Champs manquants' });
    }
    if (isNaN(aId) || isNaN(zId) || isNaN(qty)) {
      return res.status(400).json({ error: 'Valeurs invalides' });
    }
    if (!['ENTRY', 'EXIT'].includes(type)) {
      return res.status(400).json({ error: "Type invalide (ENTRY ou EXIT)" });
    }
    if (qty <= 0) {
      return res.status(400).json({ error: "La quantité doit être > 0" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Lire le stock courant
      const current = await tx.stock.findUnique({
        where: { articleId_zoneId: { articleId: aId, zoneId: zId } }
      });

      let newQuantity = current ? current.quantity : 0;
      if (type === 'ENTRY') {
        newQuantity += qty;
      } else {
        // EXIT
        if (newQuantity - qty < 0) {
          throw new Error('STOCK_NEGATIF');
        }
        newQuantity -= qty;
      }

      // Upsert du Stock
      const stock = await tx.stock.upsert({
        where: { articleId_zoneId: { articleId: aId, zoneId: zId } },
        update: { quantity: newQuantity },
        create: { articleId: aId, zoneId: zId, quantity: newQuantity }
      });

      // Créer le mouvement
      const movement = await tx.stockMovement.create({
        data: {
          articleId: aId,
          zoneId: zId,
          quantity: qty,
          type,
          reason: reason || null
        },
        include: {
          article: { select: { id: true, name: true } },
          zone: { select: { id: true, name: true } }
        }
      });

      return { stock, movement };
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'STOCK_NEGATIF') {
      return res.status(400).json({ error: 'Stock insuffisant pour la sortie' });
    }
    console.error('Erreur création mouvement de stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { createStockMovement };
