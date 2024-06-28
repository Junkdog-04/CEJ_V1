const express = require('express'); // Importa Express
const path = require('path'); // Importa Path para manejar rutas de archivos y directorios
const mongoose = require('mongoose'); // Importa Mongoose para interactuar con MongoDB
const cookieParser = require('cookie-parser'); // Importa Cookie-Parser para manejar cookies
const app = express(); // Crea una instancia de Express
require('dotenv').config(); // Carga variables de entorno desde un archivo .env

// Importar el modelo Course
const Course = require('./models/courseModel');

// Conectar a la base de datos
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Conectado a la base de datos');
        // Prueba de conexión
        mongoose.connection.db.listCollections().toArray((err, collections) => {
            if (err) {
                console.error('Error al listar colecciones:', err);
            } else {
                console.log('Colecciones en la base de datos:', collections);
            }
        });
    })
    .catch((error) => console.error('Error de conexión a la base de datos:', error));

// Middleware para parsear JSON, cookies y servir archivos estáticos
app.use(express.json()); // Middleware para parsear cuerpos de solicitud en formato JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear cuerpos de solicitud URL-encoded
app.use(cookieParser()); // Middleware para parsear cookies
app.use(express.static(path.join(__dirname, '../public'))); // Middleware para servir archivos estáticos desde el directorio 'public'

// Configuración de EJS como motor de vistas
app.set('view engine', 'ejs'); // Establece EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Establece la ubicación de las vistas en el directorio 'views'

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const examRoutes = require('./routes/examRoutes');
const registerRoutes = require('./routes/registerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require('./middleware/authMiddleware'); // Importa el middleware de autenticación

// Usar rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/courses', courseRoutes); // Rutas de cursos
app.use('/exams', examRoutes); // Rutas de exámenes
app.use('/register', registerRoutes); // Rutas de registro
app.use('/admin', authMiddleware, adminRoutes); // Rutas de administración protegidas por middleware de autenticación
app.use('/dashboard', authMiddleware, async (req, res) => { // Ruta del dashboard del usuario
    const courses = await Course.find(); // Obtiene todos los cursos
    res.render('pages/dashboard', { user: req.user, courses }); // Renderiza la vista del dashboard con los datos del usuario y los cursos
});

// Endpoint para obtener cursos y renderizar la página principal
app.get('/', async (req, res) => {
    try {
        const courses = await Course.find(); // Obtiene todos los cursos
        res.render('pages/index', { courses }); // Renderiza la vista principal con los cursos
    } catch (err) {
        res.status(500).json({ message: err.message }); // Manejo de errores
    }
});

// Configuración del puerto
const PORT = process.env.PORT || 3000; // Establece el puerto del servidor
const HOST = '0.0.0.0'; // Establece el host del servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`); // Mensaje en la consola al iniciar el servidor
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  });