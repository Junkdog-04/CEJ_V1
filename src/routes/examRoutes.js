const express = require('express');
const router = express.Router();

// Controladores
const examController = require('../controllers/examController');

// Definir rutas para exámenes aquí
router.get('/', examController.getExams);

module.exports = router;
