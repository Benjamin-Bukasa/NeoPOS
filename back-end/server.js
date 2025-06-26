const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const server = express();
const articlesRouter = require('./routes/articles');
const salesRouter = require('./routes/sales');


server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/pamoja/api/articles', articlesRouter);
server.use('/pamoja/api/saleArticles', salesRouter);







server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});