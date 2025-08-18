// 📁 controllers/shopController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const dayjs = require('dayjs');

// 🔹 Créer une boutique avec un admin
const createShopWithAdmin = async (req, res) => {
  const { name, email, address, phone, adminName, adminEmail, password } = req.body;
  try {
    const existingShop = await prisma.shop.findUnique({ where: { email } });
    if (existingShop) return res.status(400).json({ error: 'Email déjà utilisé.' });

    const shop = await prisma.shop.create({
      data: {
        name,
        email,
        address,
        phone,
        users: {
          create: {
            name: adminName,
            email: adminEmail,
            password,
            role: 'ADMIN'
          }
        }
      },
      include: { users: true }
    });

    res.status(201).json(shop);
  } catch (error) {
    console.error('Erreur createShopWithAdmin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🔹 Liste des boutiques
const getAllShops = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🔹 Modifier une boutique
const updateShop = async (req, res) => {
  const { id } = req.params;
  const { name, email, address, phone } = req.body;
  try {
    const updated = await prisma.shop.update({
      where: { id: parseInt(id) },
      data: { name, email, address, phone }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🔹 Supprimer une boutique
const deleteShop = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.shop.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Boutique supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🔹 Souscrire à un abonnement SaaS (désactivé)
// const subscribeShop = async (req, res) => {
//   res.status(501).json({ error: 'Abonnement désactivé' });
// };

// 🔹 Vérifier l'accès à la boutique (ne vérifie plus l'abonnement)
const checkAccess = async (req, res) => {
  const { shopId } = req.params;
  try {
    const shop = await prisma.shop.findUnique({ where: { id: parseInt(shopId) } });
    if (!shop) return res.status(403).json({ error: 'Boutique non trouvée' });

    // On ne vérifie plus l'abonnement ni le nombre d'utilisateurs
    res.json({ access: true });
  } catch (error) {
    console.error('Erreur checkAccess:', error);
    res.status(500).json({ error: 'Erreur accès' });
  }
};

module.exports = {
  createShopWithAdmin,
  getAllShops,
  updateShop,
  deleteShop,
  subscribeShop,
  checkAccess
};
