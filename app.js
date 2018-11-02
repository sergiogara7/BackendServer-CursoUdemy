// Requires
var express= require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
// Requires propios
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log('Conexion exitosa!! - Mongo 27017: \x1b[32m%s\x1b[0m','online');
});

// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3700,()=>{
    console.log('Conexion exitosa!! - Express server puerto 3700: \x1b[32m%s\x1b[0m','online');
})