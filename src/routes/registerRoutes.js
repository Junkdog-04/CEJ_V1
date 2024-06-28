const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Ruta para mostrar el formulario de registro
router.get('/:secret', registerController.renderRegisterPage);

// Ruta para manejar el envío del formulario de registro
router.post('/', registerController.registerUser);

module.exports = router;
