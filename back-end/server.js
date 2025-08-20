const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;
const server = express();

// Imports des routes
const shopRoutes = require('./routes/shop');
const stockAlertRoutes = require('./routes/stockAlert');
const articlesRouter = require('./routes/articles');
const salesRouter = require('./routes/sales');
const salesStats = require('./routes/salesStats');
const authRoutes = require('./routes/auth.routes.js');
const stockRoutes = require('./routes/stock');
const inventoryRoutes = require('./routes/inventory');
const parameterRoutes = require('./routes/parameter');
const supplierRoutes = require('./routes/supplier');
const categoryRoutes = require('./routes/category');
const subCategoryRoutes = require('./routes/subCategory');
const zoneRoutes = require('./routes/zoneRoutes');
const stockMovementsRoutes = require('./routes/stockMovements');
const logRoutes = require('./routes/log');

// Middlewares
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utilisation des routes
server.use('/pamoja/api/shops', shopRoutes);
server.use('/pamoja/api/stock-alerts', stockAlertRoutes);
server.use('/pamoja/api/auth', authRoutes);
server.use('/pamoja/api/articles', articlesRouter);
server.use('/pamoja/api/saleArticles', salesRouter); // ✅ inclut aussi /report
server.use('/pamoja/api/salesStats', salesStats);
server.use('/pamoja/api/stocks', stockRoutes);
server.use('/pamoja/api/inventories', inventoryRoutes);
server.use('/pamoja/api/parameters', parameterRoutes);
server.use('/pamoja/api/suppliers', supplierRoutes);
server.use('/pamoja/api/categories', categoryRoutes);
server.use('/pamoja/api/subcategories', subCategoryRoutes);
server.use('/pamoja/api/zones', zoneRoutes);
server.use('/pamoja/api/stockMovements', stockMovementsRoutes);
server.use('/pamoja/api/logs', logRoutes);

// Lancement du serveur
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
