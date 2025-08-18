const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const subCategory = await prisma.subCategory.create({ data: { name, categoryId } });
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await prisma.subCategory.findMany();
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
