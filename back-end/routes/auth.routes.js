const express = require('express');
const router = express.Router();

const { login, registerUser, getCurrentUser } = require('../controllers/auth.controller');
const { authenticateUser } = require('../middlwares/auth');
const requireRole = require('../middlwares/role');



// Seul ADMIN peut créer un utilisateur
router.post('/register-user', authenticateUser, requireRole('ADMIN'), registerUser);

router.post('/login', login);
router.get('/me', getCurrentUser); // Récupération de l'utilisateur connecté



module.exports = router;
