// **
// **** REQUIRES ****
// **
// == Requires
var express= require('express');

// **
// **** INICIAR VARIABLES ****
// **
// == app express
var app = express();

// **
// **** CONTENIDO - RUTAS ****
// **
// == Inicio
app.get('/',(req, res, next)=>{
    res.status(200).send({
        ok: true,
        message:'Hola, mela la prueba'
    })
});

// **
// **** EXPORTE ****
// **
module.exports = app;