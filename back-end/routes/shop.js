const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateUser } = require('../middlwares/auth');
const requireRole = require('../middlwares/role');

// Créer une boutique et lier un utilisateur existant
router.post('/create', authenticateUser, requireRole('ADMIN'), async (req, res) => {
  const { name, userId } = req.body;
  if (!name || !userId) return res.status(400).json({ error: 'Nom et userId requis' });
  try {
    const shop = await prisma.shop.create({
      data: { name }
    });
    await prisma.user.update({
      where: { id: userId },
      data: { shopId: shop.id }
    });
    res.status(201).json({ message: 'Boutique créée et utilisateur lié', shop });
  } catch (error) {
    console.error('Erreur création boutique :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
