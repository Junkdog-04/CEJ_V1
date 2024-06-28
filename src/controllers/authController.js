// src/controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    res.render('pages/login');
};

exports.postLogin = async (req, res) => {
    try {
        console.log("Intento de inicio de sesión:", req.body.document);

        const { document, password } = req.body;

        if (!document || !password) {
            console.log("Faltan campos:", { document, password });
            return res.status(400).json({ success: false, message: 'Documento y contraseña son requeridos.' });
        }

        const user = await User.findOne({ document }).select('+password');

        if (!user) {
            console.log("Usuario no encontrado:", document);
            return res.status(400).json({ success: false, message: 'Documento o contraseña incorrectos.' });
        }

        console.log("Contraseña almacenada:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Comparación de contraseña:", isMatch);

        if (!isMatch) {
            console.log("Contraseña incorrecta para:", document);
            return res.status(400).json({ success: false, message: 'Documento o contraseña incorrectos.' });
        }

        req.session.userId = user._id;
        req.session.userRole = user.role;

        const redirectUrl = user.role === 'ADMIN' ? '/adminDashboard' : '/dashboard';

        console.log("Inicio de sesión exitoso para:", document, "Rol:", user.role);
        res.json({ success: true, message: 'Inicio de sesión exitoso.', redirectUrl });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
};