const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 📦 Récupération des ventes
const getAllSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: true,
        items: {
          include: {
            article: {
              include: { stocks: true }
            }
          }
        }
      }
    });

    const formattedSales = sales.flatMap(sale =>
      sale.items.map(item => {
        const totalStock = item.article?.stocks?.reduce((sum, s) => sum + s.quantity, 0) || 0;

        return {
          id: sale.id,
          ticketNo: sale.ticketNo,
          date: sale.date,
          sellerName: sale.user?.name || 'N/A',
          articleName: item.article?.name || 'Article inconnu',
          image: item.article?.image || null,
          price: item.unitPrice,
          quantitySold: item.quantity,
          stock: totalStock
        };
      })
    );

    res.status(200).json(formattedSales);
  } catch (error) {
    console.error('Erreur getAllSales :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ➕ Enregistrement d'une vente
const createSale = async (req, res) => {
  const defaultSellerId = 1;
  const { date, items, zone = 'Zone A', status = 'NORMAL' } = req.body;

  try {
    const saleDate = new Date(date);
    const y = saleDate.getFullYear();
    const m = String(saleDate.getMonth() + 1).padStart(2, '0');
    const d = String(saleDate.getDate()).padStart(2, '0');
    const dateString = `${y}${m}${d}`;

    const count = await prisma.sale.count({
      where: {
        date: {
          gte: new Date(`${y}-${m}-${d}T00:00:00`),
          lte: new Date(`${y}-${m}-${d}T23:59:59`)
        }
      }
    });

    const ticketNo = `${dateString}-${String(count + 1).padStart(3, '0')}`;

    const sale = await prisma.sale.create({
      data: {
        ticketNo,
        date: saleDate,
        status,
        zone,
        sellerId: defaultSellerId,
        items: {
          create: items.map(i => ({
            articleId: i.id,
            quantity: i.quantity,
            unitPrice: typeof i.unitPrice === 'number' ? i.unitPrice : 0,
            discount: typeof i.discount === 'number' ? i.discount : 0
          }))
        }
      },
      include: {
        items: true
      }
    });

    await prisma.ticket.create({
      data: {
        saleId: sale.id,
        type: 'SALE'
      }
    });

    // 🔻 Mise à jour du stock
    for (const item of sale.items) {
      const stockRecord = await prisma.stock.findFirst({
        where: {
          articleId: item.articleId,
        },
      });

      if (stockRecord) {
        await prisma.stock.update({
          where: { id: stockRecord.id },
          data: {
            quantity: stockRecord.quantity - item.quantity,
          },
        });
      }
    }

    res.status(201).json({ message: 'Vente enregistrée', sale });
  } catch (error) {
    console.error('Erreur createSale :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


// 🔍 Détails d'une vente
const getSaleById = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: { article: true }
        },
        user: true
      }
    });

    if (!sale) return res.status(404).json({ error: 'Vente non trouvée' });
    res.status(200).json(sale);
  } catch (error) {
    console.error('Erreur getSaleById :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// 🗑 Suppression
const deleteSale = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.sale.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Vente supprimée' });
  } catch (error) {
    console.error('Erreur deleteSale :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✏️ Mise à jour
const updateSale = async (req, res) => {
  const { id } = req.params;
  const { date, items } = req.body;

  try {
    const updated = await prisma.sale.update({
      where: { id: parseInt(id) },
      data: {
        date: new Date(date),
        items: {
  create: items.map(item => ({
    articleId: item.id,
    quantity: item.quantity,
    unitPrice: typeof item.sellingPrice === 'number' ? item.sellingPrice : 0,
    discount: typeof item.discount === 'number' ? item.discount : 0
  }))
        }
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error('Erreur updateSale :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  getAllSales,
  createSale,
  getSaleById,
  deleteSale,
  updateSale
};
