const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createStock = async (req, res) => {
  const { articleId, zoneId, quantity } = req.body;

  try {
    const stock = await prisma.stock.create({
      data: {
        articleId,
        zoneId,
        quantity
      }
    });
    res.status(201).json(stock);
  } catch (error) {
    console.error('Erreur lors de la création du stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

const updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const stock = await prisma.stock.update({
      where: { id: parseInt(id) },
      data: { quantity }
    });
    res.status(200).json(stock);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

const getStocks = async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        article: true,
        zone: true
      }
    });
    res.status(200).json(stocks);
  } catch (error) {
    console.error('Erreur lors de la récupération des stocks :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

const deleteStock = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.stock.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du stock :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  createStock,
    updateStock,
    getStocks,
    deleteStock
};