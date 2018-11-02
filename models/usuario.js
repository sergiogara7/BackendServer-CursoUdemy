// requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// esquemma
var Schema = mongoose.Schema;

var rolesValidos ={
    values: ['USER_ROLE','ADMIN_ROLE'],
    message: "{VALUE} No es un rol valido"
};

var usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es obligatorio']},
    apellido: {type: String, required: [true, 'El apellido es obligatorio']},
    correo: {type: String, unique:true, required: [true, 'El correo es obligatorio']},
    contrasena: {type: String, required: [true, 'La contraseña es obligatorio']},
    img: {type: String, required: false},
    rol: {type: String, required:true, default:'USER_ROLE',enum:rolesValidos}
});

usuarioSchema.plugin(uniqueValidator,{message:"El {PATH} debe ser unico"})

module.exports = mongoose.model('Usuario', usuarioSchema);