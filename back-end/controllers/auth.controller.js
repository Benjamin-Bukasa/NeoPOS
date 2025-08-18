const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();



const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { shop: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Si l'utilisateur n'a pas de boutique, on autorise la connexion (retourne un token sans shopId)
    if (!user.shop) {
      const tokenLogin = generateToken({ userId: user.id, role: user.role });
      return res.json({ token: tokenLogin, user: { id: user.id, name: user.name, role: user.role, shopId: null } });
    }

    // Si l'utilisateur a une boutique, on ne bloque plus la connexion même sans abonnement actif
    const tokenLogin = generateToken({ userId: user.id, shopId: user.shopId, role: user.role });
    return res.json({ token: tokenLogin, user: { id: user.id, name: user.name, role: user.role, shopId: user.shopId } });
  } catch (error) {
    console.error('Erreur login :', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

const getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        shop: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // On ne vérifie plus l'abonnement, seulement l'existence de la boutique
    if (!user.shop) {
      return res.status(403).json({ error: 'Boutique non trouvée pour cet utilisateur' });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopId: user.shopId,
        shopName: user.shop.name,
      },
    });
  } catch (err) {
    console.error('Erreur getCurrentUser :', err);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Création d'un utilisateur simple (hors boutique)
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email existe déjà' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
    });
    res.status(201).json({ message: 'Utilisateur créé', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Erreur registerUser :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  registerUser,
  login,
  getCurrentUser,
};