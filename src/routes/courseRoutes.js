// src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel'); // Importa el modelo de curso
const authMiddleware = require('../middleware/authMiddleware'); // Importa el middleware de autenticación

// Obtener todos los cursos
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find(); // Encuentra todos los cursos en la base de datos
        res.json(courses); // Responde con los cursos encontrados en formato JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Si hay un error, responde con un mensaje de error
    }
});

// Crear un nuevo curso
router.post('/', authMiddleware, async (req, res) => {
    // Usa el middleware de autenticación para proteger la ruta
    const course = new Course({
        title: req.body.title, // Obtiene el título del cuerpo de la solicitud
        description: req.body.description, // Obtiene la descripción del cuerpo de la solicitud
        price: req.body.price, // Obtiene el precio del cuerpo de la solicitud
        thumbnail: req.body.thumbnail // Obtiene la URL de la miniatura del cuerpo de la solicitud
    });

    try {
        const newCourse = await course.save(); // Guarda el nuevo curso en la base de datos
        res.status(201).json(newCourse); // Responde con el curso creado y el estado 201
    } catch (err) {
        res.status(400).json({ message: err.message }); // Si hay un error, responde con un mensaje de error 400
    }
});

// Ruta de búsqueda de cursos
router.get('/search', async (req, res) => {
    const query = req.query.query; // Obtiene el término de búsqueda de la consulta de la solicitud
    try {
        const courses = await Course.find({ title: { $regex: query, $options: 'i' } }); // Busca cursos cuyo título coincida con el término de búsqueda, sin importar mayúsculas o minúsculas
        res.json(courses); // Responde con los cursos encontrados en formato JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Si hay un error, responde con un mensaje de error
    }
});

// Ruta para ver un curso específico
router.get('/:id', authMiddleware, async (req, res) => {
    // Usa el middleware de autenticación para proteger la ruta
    try {
        const course = await Course.findById(req.params.id); // Encuentra el curso por su ID
        if (course) {
            res.render('pages/course', { course }); // Renderiza la vista 'course.ejs' pasando el curso encontrado
        } else {
            res.status(404).send('Curso no encontrado'); // Si no se encuentra el curso, responde con un mensaje de error 404
        }
    } catch (err) {
        res.status(500).json({ message: err.message }); // Si hay un error, responde con un mensaje de error
    }
});

module.exports = router; // Exporta el enrutador para que pueda ser utilizado en otros archivos
