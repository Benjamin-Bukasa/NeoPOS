const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ➕ CREATE
const createSupplier = async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    if (!name) return res.status(400).json({ error: "Le nom est requis" });

    const supplier = await prisma.supplier.create({
      data: { name, contact, address },
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error("Erreur createSupplier :", error);
    res.status(500).json({ error: error.message });
  }
};

// 📋 READ (tous les fournisseurs)
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    console.error("Erreur getSuppliers :", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔎 READ (un fournisseur par ID)
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!supplier) {
      return res.status(404).json({ error: "Fournisseur introuvable" });
    }

    res.json(supplier);
  } catch (error) {
    console.error("Erreur getSupplierById :", error);
    res.status(500).json({ error: error.message });
  }
};

// ✏️ UPDATE
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, address } = req.body;

    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { name, contact, address },
    });

    res.json(supplier);
  } catch (error) {
    console.error("Erreur updateSupplier :", error);
    res.status(500).json({ error: error.message });
  }
};

// ❌ DELETE
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // No content
  } catch (error) {
    console.error("Erreur deleteSupplier :", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
