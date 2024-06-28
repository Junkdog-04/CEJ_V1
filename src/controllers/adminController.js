// src/controllers/adminController.js

const Course = require('../models/courseModel');

// Mostrar el dashboard del administrador
exports.getAdminDashboard = async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('pages/adminDashboard', { courses });
    } catch (err) {
        res.status(500).send('Error al cargar el dashboard de administrador');
    }
};

// Crear un nuevo curso
exports.createCourse = async (req, res) => {
    const { title, description, price, thumbnail, modules } = req.body;

    const course = new Course({
        title,
        description,
        price,
        thumbnail,
        modules: modules.map(module => ({
            title: module.title,
            videoId: module.videoId,
            material: module.material
        }))
    });

    try {
        await course.save();
        res.redirect('/admin/dashboard');
    } catch (err) {
        res.status(500).send('Error al crear el curso');
    }
};
