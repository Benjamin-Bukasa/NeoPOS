const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create or update parameters (singleton)
exports.setParameters = async (req, res) => {
  try {
    const { tva, ticketDiscountRate, articleDiscountRate } = req.body;
    let param = await prisma.parameter.findFirst();
    if (param) {
      param = await prisma.parameter.update({
        where: { id: param.id },
        data: { tva, ticketDiscountRate, articleDiscountRate },
      });
    } else {
      param = await prisma.parameter.create({
        data: { tva, ticketDiscountRate, articleDiscountRate },
      });
    }
    res.json(param);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get parameters
exports.getParameters = async (req, res) => {
  try {
    const param = await prisma.parameter.findFirst();
    res.json(param);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
