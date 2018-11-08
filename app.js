// **
// **** REQUIRES ****
// **
// == Requires
var express= require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
// == Routes propios
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// **
// **** INICIAR VARIABLES ****
// **
// == app express
var app = express();

// **
// **** CONTENIDO  ****
// **
// == body Parser
// == parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// == parse application/json
app.use(bodyParser.json());

// == Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log('Conexion exitosa!! - Mongo 27017: \x1b[32m%s\x1b[0m','online');
});

// == Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

// == escuchar peticiones - iniciar servidor
app.listen(3700,()=>{
    console.log('Conexion exitosa!! - Express server puerto 3700: \x1b[32m%s\x1b[0m','online');
})