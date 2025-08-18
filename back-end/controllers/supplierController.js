const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    const supplier = await prisma.supplier.create({ data: { name, contact, address } });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
