const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// Configuration de multer pour enregistrer les fichiers dans le dossier uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + uniqueSuffix + ext);
	}
});
const upload = multer({ storage });

const { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle,importManyArticles } = require('../controllers/articles');

// Route to get all articles
router.get('/getAllArticles', getAllArticles);

// Route to get a single article by ID
router.get('/getArticle/:id', getArticleById);

// Route to create a new article (with multer for multipart/form-data)
router.post('/createNewArticle', upload.single('image'), createArticle);

// Route to update an existing article (avec gestion image)
router.put('/updateArticle/:id', upload.single('image'), updateArticle);

// Route to delete an article
router.delete('/deleteArticle/:id', deleteArticle);

// Import en masse depuis CSV
router.post("/importMany", upload.single("file"), importManyArticles);


module.exports = router;