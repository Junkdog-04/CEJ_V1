const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Conexión a la base de datos
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a la base de datos exitosa');
}).catch((error) => {
    console.error('Error conectando a la base de datos:', error);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Middleware de autenticación
const authenticate = (req, res, next) => {
    const userId = req.cookies.userId;
    if (userId) {
        req.userId = userId;
        next();
    } else {
        res.status(401).json({ success: false, message: 'Autenticación requerida' });
    }
};

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
});

// Iniciar el servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
