// Requires
var express= require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log('Conexion exitosa!! - Mongo 27017: \x1b[32m%s\x1b[0m','online');
});

// Rutas
app.get('/',(req, res, next)=>{
    res.status(200).send({
        ok: true,
        message:'Hola, mela la prueba'
    })
});

// escuchar peticiones
app.listen(3700,()=>{
    console.log('Conexion exitosa!! - Express server puerto 3700: \x1b[32m%s\x1b[0m','online');
})