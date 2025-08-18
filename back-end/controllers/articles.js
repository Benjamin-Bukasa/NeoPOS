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
  try {
    // Pour multipart/form-data, req.body contient tout sauf les fichiers, req.file(s) contient les fichiers
    if (!req.body) {
      return res.status(400).json({ error: 'Aucune donnée reçue (body manquant)' });
    }
    let data = req.body;
    // Conversion des types (car FormData envoie tout en string)
    data.purchasePrice = data.purchasePrice ? parseFloat(data.purchasePrice) : null;
    data.sellingPrice = data.sellingPrice ? parseFloat(data.sellingPrice) : null;
    data.supplierId = data.supplierId ? parseInt(data.supplierId) : undefined;
    data.subCategoryId = data.subCategoryId ? parseInt(data.subCategoryId) : null;

    // Si un fichier image est uploadé, on enregistre le chemin relatif dans la BDD
    if (req.file) {
      // On stocke le chemin relatif pour l'accès depuis le front-end
      data.image = `/uploads/${req.file.filename}`;
    }

    // Vérification sous-catégorie obligatoire
    if (!data.subCategoryId) return res.status(400).json({ error: 'Sous-catégorie obligatoire' });
    const subCategory = await prisma.subCategory.findUnique({ where: { id: data.subCategoryId } });
    if (!subCategory) return res.status(400).json({ error: 'Sous-catégorie introuvable' });

    // Préparation de la donnée pour Prisma
    const prismaData = {
      name: data.name,
      type: data.type,
      barcode: data.barcode || undefined,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      subCategory: { connect: { id: data.subCategoryId } },
      supplier: data.supplierId ? { connect: { id: data.supplierId } } : undefined,
      image: data.image || undefined,
      color: data.color || undefined,
      size: data.size || undefined,
      brand: data.brand || undefined,
      model: data.model || undefined,
      description: data.description || undefined,
      updatedBy: data.updatedBy || undefined
    };

    const article = await prisma.article.create({ data: prismaData });
    res.status(201).json(article);
  } catch (error) {
    console.error('Erreur création article :', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

const updateArticle = async (req, res) => {
  const { id } = req.params;
  let data = req.body;

  // Conversion des types (FormData envoie tout en string)
  data.purchasePrice = data.purchasePrice ? parseFloat(data.purchasePrice) : null;
  data.sellingPrice = data.sellingPrice ? parseFloat(data.sellingPrice) : null;
  data.supplierId = data.supplierId ? parseInt(data.supplierId) : undefined;
  data.subCategoryId = data.subCategoryId ? parseInt(data.subCategoryId) : null;

  // Si une nouvelle image est uploadée, on met à jour le champ image
  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  // Supprimer les champs non modifiables par Prisma
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;

  try {
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data
    });
    res.status(200).json(article);
  } catch (error) {
    console.error('Erreur updateArticle :', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
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
