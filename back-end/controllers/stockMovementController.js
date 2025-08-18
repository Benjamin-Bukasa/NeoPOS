const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Créer un mouvement de stock (entrée ou sortie)
const createStockMovement = async (req, res) => {
  try {
    const { articleId, zoneId, quantity, type, reason } = req.body;
    if (!articleId || !zoneId || !quantity || !type) {
      return res.status(400).json({ error: 'Champs manquants' });
    }
    // Créer le mouvement
    const movement = await prisma.stockMovement.create({
      data: {
        articleId: parseInt(articleId),
        zoneId: parseInt(zoneId),
        quantity: parseInt(quantity),
        type,
        reason: reason || null,
      }
    });
    // Mettre à jour le stock
    const stock = await prisma.stock.findUnique({
      where: {
        articleId_zoneId: {
          articleId: parseInt(articleId),
          zoneId: parseInt(zoneId)
        }
      }
    });
    let newQuantity = stock ? stock.quantity : 0;
    if (type === 'ENTRY') newQuantity += parseInt(quantity);
    else if (type === 'EXIT') newQuantity -= parseInt(quantity);
    if (stock) {
      await prisma.stock.update({
        where: { id: stock.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.stock.create({
        data: {
          articleId: parseInt(articleId),
          zoneId: parseInt(zoneId),
          quantity: newQuantity
        }
      });
    }
    res.status(201).json(movement);
  } catch (error) {
    console.error('Erreur création mouvement de stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { createStockMovement };
