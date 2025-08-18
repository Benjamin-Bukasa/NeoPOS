const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requis' });

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
      return res.status(403).json({ error: 'Utilisateur invalide' });
    }

  req.userId = decoded.userId;
  req.shopId = decoded.shopId;
  req.userRole = decoded.role;
  req.user = user; // Injection de l'objet user pour les middlewares de rôle
  next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = {
  authenticateUser
};
