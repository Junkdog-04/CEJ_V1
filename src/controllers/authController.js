const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    res.render('pages/login');
};

exports.postLogin = async (req, res) => {
    try {
        console.log("Intento de inicio de sesión:", req.body.name);

        const { document, name, password } = req.body;

        if (!document || !name || !password) {
            console.log("Faltan campos:", { document, name, password });
            return res.status(400).json({ success: false, message: 'Documento, nombre y contraseña son requeridos.' });
        }

        const user = await User.findOne({ $or: [{ document }, { name }] }).select('+password');

        if (!user) {
            console.log("Usuario no encontrado para documento o nombre:", document, name);
            return res.status(400).json({ success: false, message: 'Documento o nombre o contraseña incorrectos.' });
        }

        console.log("Contraseña almacenada:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Comparación de contraseña:", isMatch);

        if (!isMatch) {
            console.log("Contraseña incorrecta para:", document || name);
            return res.status(400).json({ success: false, message: 'Documento o nombre o contraseña incorrectos.' });
        }

        // Establecer userId en una cookie
        res.cookie('userId', user._id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        const redirectUrl = user.role === 'ADMIN' ? '/adminDashboard' : '/dashboard';

        console.log("Inicio de sesión exitoso para:", document || name, "Rol:", user.role);
        res.json({ success: true, message: 'Inicio de sesión exitoso.', redirectUrl });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
};
