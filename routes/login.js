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
var CLIENT_ID = require('../config/config').CLIENT_ID;
// == Requires Google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// **
// **** INICIAR VARIABLES ****
// **
// == app express
var app = express();

// **
// **** CONTENIDO - RUTAS ****
// **
// == Login Propio
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
// == Login Google
app.post('/google', async(req, res)=>{
    // variables recibidas
    let token = req.body.token;
    // ***
    // ****
    // ***** MIENTRAS ESTE BAJO EL PROXY - INICIO
    if(true){
        var googleUser = {
            nombre: 'Sergio Gallego',
            correo: 'sergiogara7@gmail.com',
            img: 'img.jpg',
            google: true
        }
    }else{
    // variabe para almacenar usuario
    var googleUser;
    // Verificar token de google y traer datos
    try {
        googleUser = await verify(token);
    } catch (err) {
        return res.status(403).json({
            ok: false,
            message: 'Token no valido',
            errors: err.message,
            client: CLIENT_ID,
            token: token
        });
    }
    }
    // ***** MIENTRAS ESTE BAJO EL PROXY - FIN
    // ****
    // ***
    // Valido si es usuario esta registrado en la db
    Usuario.findOne({correo: googleUser.correo},(err, usuarioDB)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar el correo',
                errors: err
            });
        }
        // valido si el usuario existe
        if(usuarioDB){
            // si existe, valido que este por google
            if(!usuarioDB.google){
                // si no esta, retorno un error
                return res.status(400).json({
                    ok: false,
                    message:'Usuario con autenticacion normal',
                    errors: {message:"Debes usar la autenticacion normal"}
                }) 
            }else{
                // Si esta, Se crea el token
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
            }  
        }else{
            // Como el usuario no existe hay que crearlo
            var usuarioNuevo = new Usuario();
            // agrego los datos al usuario
            usuarioNuevo.nombre = googleUser.nombre;
            usuarioNuevo.apellido = '.';
            usuarioNuevo.correo = googleUser.correo;
            usuarioNuevo.contrasena = '.l.';
            usuarioNuevo.img = googleUser.img;
            usuarioNuevo.google = googleUser.google;
            // guardo en la db
            usuarioNuevo.save((err, usuarioDB)=>{
                // valido si hay algun error y los retorno
                if(err){
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al registrar el usuario',
                        errors: err
                    });
                }
                // Si esta, Se crea el token
                let token = jwt.sign({usuario: usuarioDB},SEED,{expiresIn: 14400}); //4 horas
                // Oculto la contraseña para que no la devuelva
                usuarioDB.contrasena='.l.';
                // si todo salio bien se retornan los datos
                return res.status(201).json({
                    ok: true,
                    message: "Usuario registrado correctamente",
                    data: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });
            });
        } 
    });
    // si todo sale correcto retorno
    /*
    return res.status(200).json({
        ok: true,
        data: googleUser,
    });
    */
});

// **
// **** CONTENIDO - FUNCIONES ****
// **
// == funciones google
async function verify(token) {
    // verificar token
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    // obtener datos del usuario
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    // Retorno
    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true
    }
}

// **
// **** EXPORTE ****
// **
module.exports = app;