// src/controllers/registerController.js

const User = require('../models/userModel');

exports.renderRegisterPage = (req, res) => {
    res.render('pages/register');
};

exports.registerUser = async (req, res) => {
    const { name, document, password } = req.body;

    if (!name || !document || !password) {
        return res.status(400).send('Faltan campos obligatorios.');
    }

    try {
        const user = new User({ name, document, password });
        await user.save();
        res.status(201).send('Usuario registrado exitosamente.');
    } catch (error) {
        res.status(500).send('Error al registrar usuario.');
    }
};
