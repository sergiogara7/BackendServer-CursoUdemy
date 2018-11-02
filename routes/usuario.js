// Requires
var express = require('express');
var bcrypt = require('bcryptjs');
// Modelos
var Usuario = require('../models/usuario');
// Middleware
var mdAutenticacion = require('../middlewares/autenticacion')

// Inicializar variables
var app = express();

// Ruta principal

// **
// listar usuarios
// **
app.get('/',(req, res, next)=>{

    //usuario.find({},(err,data)=>{
        Usuario.find({},'nombre apellido correo').exec((err,data)=>{
        if(err){
            return res.status(500).send({
                ok: true,
                message:'error cargando usuarios!',
                errors: err
            })
        }
        return res.status(200).send({
            ok: true,
            message:'Lista de usuarios!',
            data: data
        })
    });
});

// **
// Verificar Token
// **


// **
// crear usuarios
// **
app.post('/',mdAutenticacion.verificaToken,(req, res)=>{
    //
    var body=req.body;
    //
    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        correo: body.correo,
        contrasena: bcrypt.hashSync(body.contrasena, 10),
        img: body.img,
        rol: body.rol

    });
    //
    usuario.save((err,usuarioNuevo)=>{
        if(err){
            return res.status(400).send({
                ok: true,
                message:'Error al crear el usuario!',
                errors: err
            })
        }
        return res.status(201).json({
            ok: true,
            message:'usuario creado correctamente!',
            data: usuarioNuevo,
            usuarioToken: req.usuario
        });
    });
    //
});

// **
// actualizar usuarios
// **
app.put('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    //
    var id = req.params.id;
    var body=req.body;
    //
    Usuario.findById(id,(err,data)=>{
        if(err){
            return res.status(500).send({
                ok: false,
                message:'Error al buscar el usuario!',
                errors: err
            })
        }
        if(!data){
            return res.status(400).send({
                ok: false,
                message:'El usuario con el id : '+ id +'!',
                errors: {message:"No existe el usuario"}
            })
        }
        //
        data.nombre=body.nombre;
        data.apellido=body.apellido;
        data.correo=body.correo;
        data.rol=body.rol;
        //
        data.save((err,usuarioEdit)=>{
            if(err){
                return res.status(400).send({
                    ok: true,
                    message:'Error al editar el usuario!',
                    errors: err
                })
            }
            usuarioEdit.contrasena=".l."
            return res.status(200).json({
                ok: true,
                message:'usuario editado correctamente!',
                data: usuarioEdit
            });
        });
    });
});

// **
// eliminar usuario
// **
app.delete('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    //
    var id = req.params.id;
    //
    Usuario.findByIdAndRemove(id,(err,usuarioRemoved)=>{
        if(err){
            return res.status(500).send({
                ok: false,
                message:'Error al eliminar el usuario!',
                errors: err
            })
        }
        if(!usuarioRemoved){
            return res.status(400).send({
                ok: false,
                message:'no existe el usuario con el id : '+ id +'!',
                errors: {message:"No existe el usuario"}
            })
        }
        return res.status(200).json({
            ok: true,
            message:'usuario eliminado correctamente!',
            data: usuarioRemoved
        });
    });
})


// export
module.exports = app;