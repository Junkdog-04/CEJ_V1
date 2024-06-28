// src/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');

// Middleware para verificar el rol del usuario
const checkRole = (req, res, next) => {
    const user = req.user; // Asumimos que req.user contiene la información del usuario autenticado
    
    if (!user) {
        return res.status(401).send('Usuario no autenticado');
    }

    if (user.role === 'Admin' || user.role === 'Writer') {
        next(); // El usuario tiene acceso permitido
    } else if (user.role === 'User') {
        res.redirect('/courses'); // Redirige a la vista de cursos si es un usuario
    } else {
        res.status(403).send('Acceso denegado');
    }
};

// Ruta para mostrar el dashboard de administración
router.get('/', checkRole, (req, res) => {
    res.render('pages/adminDashboard');
});

// Ruta para crear un nuevo curso
router.post('/create-course', checkRole, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    });

    try {
        await course.save();
        res.redirect('/admin'); // Redirige al dashboard de administración después de crear el curso
    } catch (err) {
        res.status(500).send('Error al crear el curso.');
    }
});

module.exports = router;
