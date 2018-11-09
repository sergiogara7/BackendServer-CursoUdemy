// **
// **** REQUIRES ****
// **
// == Requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// **
// **** INICIAR VARIABLES ****
// **
// == Esquema
var Schema = mongoose.Schema;
// == variable con roles validos
var rolesValidos ={
    values: ['USER_ROLE','ADMIN_ROLE'],
    message: "{VALUE} No es un rol valido"
};

// **
// **** CONTENIDO ****
// **
// == Variable a exportar
var usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es necesario']},
    apellido: {type: String, required: [true, 'El apellido es necesario']},
    correo: {type: String, unique:true, required: [true, 'El correo es necesario']},
    contrasena: {type: String, required: [true, 'La contraseña es necesaria']},
    img: {type: String, required: false},
    rol: {type: String, required:true, default:'USER_ROLE',enum:rolesValidos},
    google: { type: Boolean, default: false}
});
// == configuracion del mensaje unico
usuarioSchema.plugin(uniqueValidator,{message:"El {PATH} debe ser unico"})

// **
// **** EXPORTE ****
// **
module.exports = mongoose.model('Usuario', usuarioSchema);