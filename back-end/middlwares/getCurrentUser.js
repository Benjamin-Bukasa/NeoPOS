const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware qui récupère les informations du user courant depuis le JWT
 * et les attache à `req.currentUser`.
 */
const getCurrentUser = async (req, res, next) => {
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
        shop: {
          include: { subscription: true },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifie l'abonnement (optionnel ici, peut être déplacé dans un autre middleware)
    const now = new Date();
    if (!user.shop || !user.shop.subscription || user.shop.subscription.endDate < now || user.shop.subscription.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Abonnement inactif ou expiré' });
    }

    req.currentUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      shopId: user.shopId,
      shopName: user.shop.name,
      email: user.email,
      subscriptionValid: user.shop.subscription.endDate > now
    };

    next();
  } catch (err) {
    console.error('Erreur getCurrentUser :', err);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = getCurrentUser;
