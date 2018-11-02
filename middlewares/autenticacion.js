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