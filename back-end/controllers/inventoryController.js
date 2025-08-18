// Retourne tous les inventaires validés (toutes zones)
const getAllInventories = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        entries: {
          include: { article: true }
        },
        zone: true,
        user: true
      },
      orderBy: { date: 'desc' }
    });
    // Formatage pour le front (zoneName, userName)
    const result = inventories.map(inv => ({
      id: inv.id,
      date: inv.date,
      zoneName: inv.zone?.name || '',
      userName: inv.user?.name || '',
      entries: inv.entries
    }));
    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les inventaires :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getInventory = async (req, res) => {
  const { zoneId } = req.params;

  try {
    const inventory = await prisma.inventory.findMany({
      where: { zoneId: parseInt(zoneId) },
      include: {
        entries: {
          include: {
            article: true
          }
        }
      }
    });
    res.status(200).json(inventory);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'inventaire :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

const createInventory = async (req, res) => {
  const { date, zoneId, entries } = req.body;

  try {
    const inventory = await prisma.inventory.create({
      data: {
        date: new Date(date),
        zoneId: parseInt(zoneId),
        entries: {
          create: entries.map(entry => ({
            articleId: entry.articleId,
            counted: entry.counted
          }))
        }
      }
    });
    res.status(201).json(inventory);
  } catch (error) {
    console.error('Erreur lors de la création de l\'inventaire :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { date, zoneId, entries } = req.body;
    
    try {
    const inventory = await prisma.inventory.update({
    where: { id: parseInt(id) },
    data: {
      date: new Date(date),
      zone: zoneId ? { connect: { id: parseInt(zoneId) } } : undefined,
      entries: {
      deleteMany: {},
      create: entries.map(entry => ({
        articleId: entry.articleId,
        counted: entry.counted
      }))
      }
    }
    });
        res.status(200).json(inventory);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'inventaire :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
    }

const deleteInventory = async (req, res) => {
  const { id } = req.params;

  try {
    // Supprimer d'abord les entrées liées
    await prisma.inventoryItem.deleteMany({ where: { inventoryId: parseInt(id) } });
    await prisma.inventory.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'inventaire :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Get all categories with their subcategories
const getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategory: true
      }
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories avec sous-catégories :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getCategoriesWithSubcategories,
  getAllInventories
};