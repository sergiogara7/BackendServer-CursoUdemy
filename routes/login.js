// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// Modelos
var Usuario =require('../models/usuario');
// Constantes
var SEED = require('../config/config').SEED;

// Inicializar variables
var app = express();

// Rutas

// **
// crear usuarios
// **
app.post('/',(req, res)=>{
    //
    var body=req.body;
    //
    Usuario.findOne({correo: body.correo},(err, usuarioDB)=>{
        if(err){
            return res.status(500).send({
                ok: false,
                message:'Error en la consulta!',
                errors: err
            })
        }
        if(!usuarioDB){
            return res.status(400).send({
                ok: false,
                message:'no existe el usuario con el correo : '+ body.correo +' !',
                errors: {message:"Credenciales incorrectas"}
            })
        }
        if(!bcrypt.compareSync(body.contrasena,usuarioDB.contrasena)){
            return res.status(400).send({
                ok: false,
                message:'La contraseña no es correcta!',
                errors: {message:"Credenciales incorrectas"}
            })
        }
        // crear token
        let token = jwt.sign({usuario: usuarioDB},SEED,{expiresIn: 14400}); //4 horas
        //
        usuarioDB.contrasena=':)';
        //
        return res.status(200).json({
            ok: true,
            data: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});

// export
module.exports = app;