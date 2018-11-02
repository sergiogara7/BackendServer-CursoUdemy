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

// **
// **** CONTENIDO ****
// **
// == Variable a exportar
var medicoSchema = new Schema({
    nombre: { type: String,  unique:true, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});
// == configuracion del mensaje unico
medicoSchema.plugin(uniqueValidator,{message:"El {PATH} debe ser unico"});

// **
// **** EXPORTE ****
// **
module.exports = mongoose.model('Medico', medicoSchema);