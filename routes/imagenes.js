// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
var fs = require('fs');
const path = require('path');
// == Config
var imagenDefecto = require('../config/config').noImgDefecto;
// == Middleware
var mdAutenticacion = require('../middlewares/autenticacion');

// **
// **** INICIAR VARIABLES ****
// **
// == app express
var app = express();

// **
// **** CONTENIDO - RUTAS ****
// **
// == listar todo
app.get('/:tipo/:img',(req, res)=>{
    // Variables recibidas
    var tipo = req.params.tipo;
    var img = req.params.img;
    // ruta de imagen
    var pathImagen = path.resolve(__dirname,`../uploads/${tipo}/${img}`);
    // valido si existe el archivo
    if(fs.existsSync(pathImagen)){
        // se retorna la imagen
        res.sendfile(pathImagen);
    }else{
        // se retorna la imagen por defecto
        res.sendfile(path.resolve(__dirname,'../assets/'+imagenDefecto));
    }
});

// **
// **** EXPORTE ****
// **
module.exports = app;