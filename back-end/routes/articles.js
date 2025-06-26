const express = require('express');
const router = express.Router();

const { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require('../controllers/articles');


// Route to get all articles
router.get('/getAllArticles', getAllArticles);

// Route to get a single article by ID
router.get('/getArticle/:id', getArticleById);

// Route to create a new article
router.post('/createNewArticle', createArticle);


// Route to update an existing article
router.put('/updateArticle/:id', updateArticle);

// Route to delete an article
router.delete('/deleteArticle/:id', deleteArticle);

module.exports = router;