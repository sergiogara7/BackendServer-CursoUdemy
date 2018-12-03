// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
// == Modelos
var Medico = require('../models/medico');
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
app.get('/',(req, res)=>{
    // variable desde - opcional
    let desde = req.query.desde || 0;
    // seteo la varible
    desde = Number(desde);
    // obtener de la db
    Medico.find({},'nombre img usuario hospital').skip(desde).limit(limit).populate('usuario','nombre correo').populate('hospital').exec((err,medicos)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error cargando los medicos',
                errors: err
            });
        }
        Medico.countDocuments({},(err, conteo)=>{
            // si todo salio bien se retornan los datos
            return res.status(200).json({
                ok: true,
                message: 'Lista de medicos',
                data: medicos,
                total: conteo
            });
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
// == obtener
app.get('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    let id = req.params.id;
    // busco y elimino de la db
    Medico.findById(id).populate('usuario','nombre apellido img correo').populate('hospital').exec((err, medicoDB)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al cargar el medico',
                errors: err
            });
        }
        // valido si el medico si existe
        if(!medicoDB){
            return res.status(400).json({
                ok: false,
                message:'El medico con el id "'+ id +'" no existe',
                errors: {message:"El medico no existe"}
            })
        }
        // si todo salio bien se retornan los datos
        return res.status(200).json({
            ok: true,
            message:'Medico obtenido exitosamente',
            data: medicoDB
        });
    });
});

// **
// **** EXPORTE ****
// **
module.exports = app;