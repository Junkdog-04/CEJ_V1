const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Importa bcrypt para encriptar contraseñas

// Definición del esquema del usuario
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // El nombre es un campo obligatorio
    },
    document: {
        type: String,
        required: true, // El documento es un campo obligatorio
        unique: true // El documento debe ser único en la colección
    },
    password: {
        type: String,
        required: true // La contraseña es un campo obligatorio
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'], // El rol puede ser 'USER' o 'ADMIN'
        default: 'USER' // El rol por defecto será 'USER'
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next();
    }
});

// Creación del modelo de usuario basado en el esquema
const User = mongoose.model('User', userSchema);

// Exportación del modelo para que pueda ser utilizado en otros archivos
module.exports = User;
