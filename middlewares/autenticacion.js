// **
// **** REQUIRES ****
// **
// == Requires
var jwt = require('jsonwebtoken');
// == Constantes
var SEED = require('../config/config').SEED;

// **
// **** EXPORTE - FUNCION ****
// **
// == Token
exports.verificaToken = function(req, res, next){
    // variable recibida
    let token = req.query.token;
    // verificar token
    jwt.verify(token,SEED,(err, decode)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(401).json({
                ok: false,
                message:'El token no valido',
                errors: err
            })
        }
        // devolver variables para usar en las rutas
        req.usuario = decode.usuario;
        // pasar al siguiente proceso
        next();
        // prueba
        //return res.status(200).json({
        //    ok: false,
        //    decode: decode,
        //})
    });
}
// == Admin
exports.verificaAdminRole = function(req, res, next){
    // variable recibida
    let usuario = req.usuario
    // verificar rol
    if(usuario.rol === 'ADMIN_ROLE'){
        // pasar al siguiente proceso
        next();
    }else{
        // retorno un error
        return res.status(401).json({
            ok: false,
            message:'El permiso no es valido',
            errors: {message: 'No eres un administrador, no tienes permisos para realizar esta accion'}
        })
    }
}
// == Admin o mismo usuario
exports.verificaAdmin_o_mismoUsuario = function(req, res, next){
    // variable recibida del primer md
    let usuario = req.usuario
    // variable recibida put
    let id = req.params.id;
    // verificar rol
    if(usuario.rol === 'ADMIN_ROLE' || usuario._id === id){
        // pasar al siguiente proceso
        next();
    }else{
        // retorno un error
        return res.status(401).json({
            ok: false,
            message:'El permiso no es valido',
            errors: {message: 'No tienes permisos para realizar esta accion'}
        })
    }
}