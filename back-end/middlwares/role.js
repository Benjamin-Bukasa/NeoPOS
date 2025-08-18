// back-end/middlwares/role.js

module.exports = function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Accès refusé : rôle insuffisant' });
    }
    next();
  };
};
