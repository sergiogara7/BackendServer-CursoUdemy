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
var hospitalSchema = new Schema({
    nombre: { type: String, unique:true, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });
// == configuracion del mensaje unico
hospitalSchema.plugin(uniqueValidator,{message:"El {PATH} debe ser unico"});

// **
// **** EXPORTE ****
// **
module.exports = mongoose.model('Hospital', hospitalSchema);