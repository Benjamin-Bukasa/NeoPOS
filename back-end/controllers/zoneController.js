// controllers/zoneController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /pamoja/api/zones
 * Retourne un tableau de zones (toujours un Array, même vide)
 */
const getZones = async (req, res) => {
  try {
    const zones = await prisma.storageZone.findMany({
      orderBy: { name: 'asc' },
    });
    // Toujours renvoyer un tableau
    return res.status(200).json(Array.isArray(zones) ? zones : []);
  } catch (err) {
    console.error('Erreur getZones :', err);
    return res.status(500).json({ error: "Erreur lors de la récupération des zones" });
  }
};

/**
 * POST /pamoja/api/zones
 * Body: { name: string, location?: string }
 * Crée une zone (si tu veux empêcher les doublons par nom, ajoute une contrainte unique en base)
 */
const createZone = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Le nom est requis" });
    }

    // Si "name" n'est pas unique en base, on vérifie juste s'il existe déjà un enregistrement identique
    const existing = await prisma.storageZone.findFirst({
      where: { name: name.trim() },
    });
    if (existing) {
      return res.status(409).json({ error: "Cette zone existe déjà" });
    }

    const zone = await prisma.storageZone.create({
      data: {
        name: name.trim(),
        location: location?.trim() || null,
      },
    });

    return res.status(201).json(zone);
  } catch (err) {
    console.error('Erreur createZone :', err);
    return res.status(500).json({ error: "Erreur lors de la création de la zone" });
  }
};

module.exports = {
  getZones,
  createZone,
};
