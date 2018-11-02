// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
// == Modelos
var Medico = require('../models/medico');
// == Constantes
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
app.get('/',(req, res)=>{
    // obtener de la db
    Medico.find({},'nombre img usuario hospital').exec((err,medicos)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error cargando los medicos',
                errors: err
            });
        }
        // si todo salio bien se retornan los datos
        return res.status(200).json({
            ok: true,
            message: 'Lista de medicos',
            data: medicos
        });
    });
});
// == crear
app.post('/',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    let body=req.body;
    // variable para guardar
    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        usuario: req.usuario._id
    });
    // guardar en la db
    medico.save((err, medicoNuevo)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error al crear el medico',
                errors: err
            });
        }
        // si todo salio bien se retornan los datos
        return res.status(201).json({
            ok: true,
            message:'Medico creado exitosamente',
            data: medicoNuevo
        });
    });
});
// == editar
app.put('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    let id = req.params.id;
    let body=req.body;
    // busco en la db
    Medico.findById(id,(err, medicoEditado)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al editar el medico',
                errors: err
            });
        }
        // valido si el medico si existe
        if(!medicoEditado){
            return res.status(400).json({
                ok: false,
                message:'El medico con el id "'+ id +'" no existe',
                errors: {message:"El medico no existe"}
            })
        }
        // organizo variables a editar
        medicoEditado.nombre=body.nombre;
        if(body.hospital){
            medicoEditado.hospital=body.hospital;
        }
        // guardo en la db
        medicoEditado.save((err, medicoEditado)=>{
            // valido si hay algun error y los retorno
            if(err){
                return res.status(400).json({
                    ok: false,
                    message: 'Error al editar el medico',
                    errors: err
                });
            }
            // escondo el usuario del medico
            // medicoEditado.usuario='.l.'; ---> no funciona porque es un id
            // si todo salio bien se retornan los datos
            return res.status(200).json({
                ok: true,
                message:'Medico editado exitosamente',
                data: medicoEditado
            });
        });
    });
});
// == eliminar
app.delete('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    let id = req.params.id;
    // busco y elimino de la db
    Medico.findByIdAndRemove(id,(err, medicoEliminado)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el medico',
                errors: err
            });
        }
        // valido si el medico si existe
        if(!medicoEliminado){
            return res.status(400).json({
                ok: false,
                message:'El medico con el id "'+ id +'" no existe',
                errors: {message:"El medico no existe"}
            })
        }
        // si todo salio bien se retornan los datos
        return res.status(200).json({
            ok: true,
            message:'Medico eliminado exitosamente',
            data: medicoEliminado
        });
    });
});

// **
// **** EXPORTE ****
// **
module.exports = app;