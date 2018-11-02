// Requires
var express= require('express');

// Inicializar variables
var app = express();

// Ruta principal
app.get('/',(req, res, next)=>{
    res.status(200).send({
        ok: true,
        message:'Hola, mela la prueba'
    })
});

module.exports = app;