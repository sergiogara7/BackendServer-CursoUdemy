// Requires
var jwt = require('jsonwebtoken');
// Constantes
var SEED = require('../config/config').SEED;

exports.verificaToken = function(req, res, next){

    let token = req.query.token;

    jwt.verify(token,SEED,(err, decode)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                message:'Token no valido!',
                errors: err
            })
        }
        //
        req.usuario = decode.usuario;
        //
        next();
        //return res.status(200).json({
        //    ok: false,
        //    decode: decode,
        //})
    });
}