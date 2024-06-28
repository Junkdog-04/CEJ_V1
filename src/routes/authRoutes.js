
const express = require('express');
const router = express.Router();

// Importar el controlador de autenticación
const authController = require('../controllers/authController');
const registerController = require('../controllers/registerController');


// Ruta para mostrar la página de inicio de sesión
router.get('/login', authController.getLogin);

// Ruta para manejar el envío del formulario de inicio de sesión
router.post('/login', authController.postLogin);

// Ruta para mostrar la página de registro
router.get('/register', registerController.renderRegisterPage);

// Ruta para manejar el registro de usuarios
router.post('/register', registerController.registerUser);

module.exports = router;
