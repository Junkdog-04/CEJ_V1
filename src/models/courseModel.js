// src/models/courseModel.js

const mongoose = require('mongoose'); // Importa el módulo mongoose para manejar la base de datos MongoDB

// Definición del esquema del curso
const courseSchema = new mongoose.Schema({
    title: {
        type: String, // Define el tipo de dato como String
        required: true // El título es un campo obligatorio
    },
    description: {
        type: String, // Define el tipo de dato como String
        required: true // La descripción es un campo obligatorio
    },
    price: {
        type: Number, // Define el tipo de dato como Number
        required: true // El precio es un campo obligatorio
    },
    thumbnail: {
        type: String, // Define el tipo de dato como String
        required: true // La URL de la imagen en miniatura es un campo obligatorio
    }
});

// Creación del modelo de curso basado en el esquema
const Course = mongoose.model('Course', courseSchema); // Crea el modelo de curso utilizando el esquema definido

// Exportación del modelo para que pueda ser utilizado en otros archivos
module.exports = Course; // Exporta el modelo Course
