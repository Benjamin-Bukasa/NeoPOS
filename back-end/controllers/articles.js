const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// 🔁 Récupérer tous les articles avec stock total
const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        stocks: {
          include: { zone: true }
        },
        subCategory: { select: { name: true } },
        supplier: { select: { name: true } }
      }
    });

    const formatted = articles.map(article => ({
      ...article,
      stock: article.stocks.reduce((sum, s) => sum + s.quantity, 0),
      stocks: article.stocks.map(s => ({
        zone: s.zone.name,
        quantity: s.quantity
      })),
      subCategory: article.subCategory?.name || null,
      supplier: article.supplier?.name || null
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🔁 Récupérer un article par ID avec stock total
const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        stocks: { include: { zone: true } }
      }
    });

    if (!article) return res.status(404).json({ error: 'Article introuvable' });

    const stock = article.stocks.reduce((sum, s) => sum + s.quantity, 0);
    res.status(200).json({ 
      ...article, 
      stock,
      stocks: article.stocks.map(s => ({
        zone: s.zone.name,
        quantity: s.quantity
      }))
    });
  } catch (error) {
    console.error('Erreur getArticleById :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ➕ Créer un article (+ stock initial si zoneId & quantity)
const createArticle = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Aucune donnée reçue (body manquant)' });
    }
    let data = req.body;

    // Conversion des types
    data.purchasePrice = data.purchasePrice ? parseFloat(data.purchasePrice) : null;
    data.sellingPrice = data.sellingPrice ? parseFloat(data.sellingPrice) : null;
    const supplierId = data.supplierId ? parseInt(data.supplierId) : undefined;
    const subCategoryId = data.subCategoryId ? parseInt(data.subCategoryId) : null;
    const zoneId = data.zoneId ? parseInt(data.zoneId) : null;
    const quantity = data.quantity ? parseInt(data.quantity) : null;

    // Gestion image
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }

    // Vérif sous-catégorie obligatoire
    if (!subCategoryId) return res.status(400).json({ error: 'Sous-catégorie obligatoire' });
    const subCategory = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
    if (!subCategory) return res.status(400).json({ error: 'Sous-catégorie introuvable' });

    // Données article
    const prismaData = {
      name: data.name,
      type: data.type,
      barcode: data.barcode || undefined,
      purchasePrice: data.purchasePrice,
      sellingPrice: data.sellingPrice,
      subCategory: { connect: { id: subCategoryId } },
      supplier: supplierId ? { connect: { id: supplierId } } : undefined,
      image: data.image || undefined,
      color: data.color || undefined,
      size: data.size || undefined,
      brand: data.brand || undefined,
      model: data.model || undefined,
      description: data.description || undefined,
      updatedBy: data.updatedBy || undefined
    };

    // 1️⃣ Création de l’article
    const article = await prisma.article.create({ data: prismaData });

    // 2️⃣ Création du stock initial si zone + quantité fournis
    if (zoneId && quantity !== null) {
      await prisma.stock.create({
        data: {
          articleId: article.id,
          zoneId: zoneId,
          quantity: quantity
        }
      });
    }

    res.status(201).json(article);
  } catch (error) {
    console.error('Erreur création article :', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

const importManyArticles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = path.join(__dirname, "../..", req.file.path);
    const articles = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ";" })) // ✅ CSV séparé par ";"
      .on("data", (row) => {
        if (!row.name || !row.purchasePrice || !row.sellingPrice || !row.subCategoryId || !row.zoneId) {
          return; // ignore ligne invalide
        }

        if (!row.quantity || row.quantity.trim() === "") {
          row.quantity = 0;
        }

        articles.push(row);
      })
      .on("end", async () => {
        let inserted = 0;

        for (let art of articles) {
          // Vérifier si article existe déjà par nom
          const exists = await prisma.article.findUnique({
            where: { name: art.name },
          });
          if (exists) continue;

          // 1️⃣ Création de l’article
          const article = await prisma.article.create({
            data: {
              name: art.name,
              color: art.color || "",
              size: art.size || "",
              brand: art.brand || "",
              model: art.model || "",
              description: art.description || "",
              type: art.type || "SINGLE",
              barcode: art.barcode || "",
              purchasePrice: parseFloat(art.purchasePrice),
              sellingPrice: parseFloat(art.sellingPrice),
              supplierId: art.supplierId ? parseInt(art.supplierId) : null,
              subCategoryId: parseInt(art.subCategoryId),
              image: art.image || null,
            },
          });

          // 2️⃣ Création du stock associé
          await prisma.stock.create({
            data: {
              articleId: article.id,
              zoneId: parseInt(art.zoneId),
              quantity: parseInt(art.quantity),
            },
          });

          inserted++;
        }

        fs.unlinkSync(filePath); // ✅ supprime fichier temporaire
        res.json({ message: `${inserted} articles importés avec succès` });
      });
  } catch (err) {
    console.error("Erreur importManyArticles :", err);
    res.status(500).json({ error: err.message });
  }
};



// ✏️ Mettre à jour un article (+ stock si zoneId & quantity)
const updateArticle = async (req, res) => {
  const { id } = req.params;
  let data = req.body;

  // Conversion des types
  data.purchasePrice = data.purchasePrice ? parseFloat(data.purchasePrice) : null;
  data.sellingPrice = data.sellingPrice ? parseFloat(data.sellingPrice) : null;
  const supplierId = data.supplierId ? parseInt(data.supplierId) : undefined;
  const subCategoryId = data.subCategoryId ? parseInt(data.subCategoryId) : null;
  const zoneId = data.zoneId ? parseInt(data.zoneId) : null;
  const quantity = data.quantity ? parseInt(data.quantity) : null;

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  // Nettoyage
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.supplierId;
  delete data.subCategoryId;

  try {
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        color: data.color,
        size: data.size,
        brand: data.brand,
        model: data.model,
        description: data.description,
        type: data.type,
        barcode: data.barcode || undefined,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        image: data.image || undefined,
        updatedBy: data.updatedBy || undefined,

        // 🔗 Relations
        supplier: supplierId ? { connect: { id: supplierId } } : undefined,
        subCategory: subCategoryId ? { connect: { id: subCategoryId } } : undefined
      }
    });

    // 📦 Gestion du stock si zoneId & quantity envoyés
    if (zoneId && quantity !== null) {
      const existingStock = await prisma.stock.findUnique({
        where: {
          articleId_zoneId: {
            articleId: article.id,
            zoneId: zoneId
          }
        }
      });

      if (existingStock) {
        await prisma.stock.update({
          where: { id: existingStock.id },
          data: { quantity }
        });
      } else {
        await prisma.stock.create({
          data: {
            articleId: article.id,
            zoneId,
            quantity
          }
        });
      }
    }

    res.status(200).json(article);//
  } catch (error) {
    console.error('Erreur updateArticle :', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

// ❌ Supprimer un article
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
  deleteArticle,
  importManyArticles
};
