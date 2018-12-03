// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
var bcrypt = require('bcryptjs');
// == Modelos
var Usuario = require('../models/usuario');
// == Config
var limit = require('../config/config').LIMIT;
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
// == listar
app.get('/',(req, res, next)=>{
    // variable desde - opcional
    let desde = req.query.desde || 0;
    // seteo la varible
    desde = Number(desde);
    // obtener de la db
    //usuario.find({},(err,data)=>{
    Usuario.find({},'nombre apellido correo google rol img').skip(desde).limit(limit).exec((err,usuarios)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error cargando los usuarios',
                errors: err
            });
        }
        // cuento el total de registros 
        Usuario.countDocuments({},(err, conteo)=>{
            // si todo salio bien se retornan los datos
            return res.status(200).json({
                ok: true,
                message: 'Lista de usuarios',
                data: usuarios,
                total: conteo
            });
        });
        
    });
});
// == Crear
app.post('/',(req, res)=>{
    // variable con los datos recibidos
    var body=req.body;
    // variable para guardar
    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        contrasena: bcrypt.hashSync(body.contrasena, 10),
        img: body.img,
        rol: body.rol
    });
    // guardar en la db
    usuario.save((err,usuarioNuevo)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error al crear el usuario',
                errors: err
            });
        }
        // si todo salio bien se retornan los datos
        return res.status(201).json({
            ok: true,
            message:'Usuario creado exitosamente',
            data: usuarioNuevo
            //usuarioToken: req.usuario
        });
    });
});
// == Editar
app.put('/:id',[mdAutenticacion.verificaToken,mdAutenticacion.verificaAdmin_o_mismoUsuario],(req, res)=>{
    // variable con los datos recibidos
    var id = req.params.id;
    var body = req.body;
    // busco en la db
    Usuario.findById(id,(err, usuarioBuscado)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al editar el usuario',
                errors: err
            });
        }
        // valido si el usuario existe
        if(!usuarioBuscado){
            return res.status(400).json({
                ok: false,
                message:'El usuario con el id "'+ id +'" no existe',
                errors: {message:"El usuario no existe"}
            })
        }
        // organizo variables a editar
        usuarioBuscado.nombre=body.nombre;
        usuarioBuscado.apellido=body.apellido;
        usuarioBuscado.correo=body.correo;
        usuarioBuscado.rol=body.rol;
        // guardo en la db
        usuarioBuscado.save((err,usuarioEditado)=>{
            // valido si hay algun error y los retorno
            if(err){
                return res.status(400).json({
                    ok: false,
                    message: 'Error al editar el usuario',
                    errors: err
                });
            }
            // escondo la contraseña
            usuarioEditado.contrasena=".l."
            // si todo salio bien se retornan los datos
            return res.status(200).json({
                ok: true,
                message:'Usuario editado exitosamente',
                data: usuarioEditado
            });
        });
    });
});
// == Eliminar
app.delete('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    var id = req.params.id;
    // busco y elimino de la db
    Usuario.findByIdAndRemove(id,(err,usuarioEliminado)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el usuario',
                errors: err
            });
        }
        // valido si el usuario si existe
        if(!usuarioEliminado){
            return res.status(400).json({
                ok: false,
                message:'El usuario con el id "'+ id +'" no existe',
                errors: {message:"El usuario no existe"}
            })
        }
        // si todo salio bien se retornan los datos
        return res.status(200).json({
            ok: true,
            message:'Usuario eliminado exitosamente',
            data: usuarioEliminado
        });
    });
});

// **
// **** EXPORTE ****
// **
module.exports = app;