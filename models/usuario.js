var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido o permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El Correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String },
    rol: { type: String, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El correo debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema, 'Usuarios');