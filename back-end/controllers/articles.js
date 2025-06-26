const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔁 Calcul du stock dynamique par article
const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        stocks: true,
        subCategory: { select: { name: true } },
        supplier: { select: { name: true } }
      }
    });

    const formatted = articles.map(article => ({
      ...article,
      stock: article.stocks.reduce((sum, s) => sum + s.quantity, 0),
      subCategory: article.subCategory?.name || null,
      supplier: article.supplier?.name || null
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: { stocks: true }
    });

    if (!article) return res.status(404).json({ error: 'Article introuvable' });

    const stock = article.stocks.reduce((sum, s) => sum + s.quantity, 0);
    res.status(200).json({ ...article, stock });
  } catch (error) {
    console.error('Erreur getArticleById :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createArticle = async (req, res) => {
  const {
    name, type, barcode, purchasePrice, sellingPrice,
    supplierId, subCategoryId, image, description, updatedBy
  } = req.body;

  try {
    const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
    if (!subCategory) return res.status(400).json({ error: 'Sous-catégorie introuvable' });

    const supplierConnect = supplierId
      ? { connect: { id: supplierId } }
      : undefined;

    const article = await prisma.article.create({
      data: {
        name, type, barcode, purchasePrice, sellingPrice,
        subCategory: { connect: { id: subCategoryId } },
        supplier: supplierConnect,
        image, description, updatedBy
      }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Erreur création article :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data
    });
    res.status(200).json(article);
  } catch (error) {
    console.error('Erreur updateArticle :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.article.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur suppression article :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
