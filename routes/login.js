// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// == Modelos
var Usuario =require('../models/usuario');
// == Constantes
var SEED = require('../config/config').SEED;

// **
// **** INICIAR VARIABLES ****
// **
// == app express
var app = express();

// **
// **** CONTENIDO - RUTAS ****
// **
// == Login
app.post('/',(req, res)=>{
    // variable con los datos recibidos
    var body=req.body;
    // Buscar un solo registro en la db
    Usuario.findOne({correo: body.correo},(err, usuarioDB)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar el correo',
                errors: err
            });
        }
        // valido si el usuario existe
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                message:'El usuario con el correo "'+ body.correo +'" no existe',
                errors: {message:"Credenciales incorrectas"}
            })
        }
        // Se valida la contraseña enviada con la de la db - encriptada
        if(!bcrypt.compareSync(body.contrasena,usuarioDB.contrasena)){
            return res.status(400).json({
                ok: false,
                message:'La contraseña no es correcta',
                errors: {message:"Credenciales incorrectas"}
            })
        }
        // Se crea el token
        let token = jwt.sign({usuario: usuarioDB},SEED,{expiresIn: 14400}); //4 horas
        // Oculto la contraseña para que no la devuelva
        usuarioDB.contrasena='.l.';
        // si todo salio bien se retornan los datos
        return res.status(201).json({
            ok: true,
            data: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});

// **
// **** EXPORTE ****
// **
module.exports = app;