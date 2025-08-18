// back-end/controllers/logReport.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /pamoja/api/logs/report?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD&userId=...
async function getLogReport(req, res) {
  try {
    const { dateFrom, dateTo, userId } = req.query;
    const where = {};
    if (dateFrom && dateTo) {
      where.createdAt = {
        gte: new Date(dateFrom + 'T00:00:00'),
        lte: new Date(dateTo + 'T23:59:59'),
      };
    }
    if (userId) {
      where.userId = parseInt(userId);
    }
    const logs = await prisma.log.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    const report = logs.map(log => ({
      id: log.id,
      userName: log.user?.name || '',
      action: log.action,
      entity: log.entity,
      description: log.description,
      date: log.createdAt,
    }));
    res.json(report);
  } catch (error) {
    console.error('Erreur getLogReport:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = { getLogReport };
