const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware de vérification d'abonnement pour une boutique SaaS
 */
const checkSubscriptionAccess = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { shop: true }
    });

    if (!user || !user.shop) {
      return res.status(404).json({ error: 'Utilisateur ou boutique introuvable' });
    }

    const shop = user.shop;

    // Vérifie si l'abonnement est actif
    if (!shop.subscription || !shop.subscription.isActive) {
      return res.status(403).json({ error: "Abonnement inactif. Merci de vous abonner." });
    }

    // Vérifie si la date d'expiration est dépassée
    const now = new Date();
    if (shop.subscription.subscriptionEndDate && now > shop.subscription.subscriptionEndDate) {
      return res.status(403).json({ error: "Abonnement expiré. Merci de renouveler." });
    }

    // Vérifie le nombre maximal d'utilisateurs autorisés
    const currentUsers = await prisma.user.count({
      where: { shopId: shop.id }
    });

    if (shop.subscription.maxUsers && currentUsers > shop.subscription.maxUsers) {
      return res.status(403).json({ error: `Nombre d'utilisateurs dépassé (${currentUsers}/${shop.subscription.maxUsers})` });
    }

    // Autorisé
    next();
  } catch (error) {
    console.error('Erreur middleware abonnement :', error);
    return res.status(500).json({ error: 'Erreur serveur middleware abonnement' });
  }
};

module.exports = { checkSubscriptionAccess };
