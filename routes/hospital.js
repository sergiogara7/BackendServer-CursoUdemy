// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
// == Modelos
var Hospital = require('../models/hospital');
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
    Hospital.find({},'nombre img usuario').exec((err,hospitales)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error cargando los hospitales',
                errors: err
            });
        }
        // si todo salio bien se retornan los datos
        return res.status(200).json({
            ok: true,
            message: 'Lista de hospitales',
            data: hospitales
        });
    });
});
// == crear
app.post('/',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    let body=req.body;
    // variable para guardar
    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    // guardar en la db
    hospital.save((err, hospitalNuevo)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(400).json({
                ok: false,
                message: 'Error al crear el hospital',
                errors: err
            });
        }
        // si todo salio bien se retornan los datos
        return res.status(201).json({
            ok: true,
            message:'Hospital creado exitosamente',
            data: hospitalNuevo
        });
    });
});
// == editar
app.put('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    let id = req.params.id;
    let body=req.body;
    // busco y edito
    /* Se comenta porque con este metodo no valida los unique
    Hospital.findByIdAndUpdate(id,body,{new:true},(err, hospitalEditado)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al editar el hospital',
                errors: err
            });
        }
        // valido si el hospital si existe
        if(!hospitalEditado){
            return res.status(400).json({
                ok: false,
                message:'El hospital con el id "'+ id +'" no existe',
                errors: {message:"El hospital no existe"}
            })
        }
        // escondo el usuario del hospital
        hospitalEditado.usuario='.l.';
        // si todo salio bien se retornan los datos
        return res.status(200).json({
            ok: true,
            message:'Hospital editado exitosamente',
            data: hospitalEditado
        });
    });
    */
    // busco
    Hospital.findById(id,(err, hospitalEditado)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al editar el hospital',
                errors: err
            });
        }
        // valido si el hospital si existe
        if(!hospitalEditado){
            return res.status(400).json({
                ok: false,
                message:'El hospital con el id "'+ id +'" no existe',
                errors: {message:"El hospital no existe"}
            })
        }
        // organizo variables a editar
        hospitalEditado.nombre=body.nombre;
        // guardo en la db
        hospitalEditado.save((err, hospitalEditado)=>{
            // valido si hay algun error y los retorno
            if(err){
                return res.status(400).json({
                    ok: false,
                    message: 'Error al editar el hospital',
                    errors: err
                });
            }
            // escondo el usuario del hospital
            // hospitalEditado.usuario='.l.'; ---> no funciona porque es un id
            // si todo salio bien se retornan los datos
            return res.status(200).json({
                ok: true,
                message:'Hospital editado exitosamente',
                data: hospitalEditado
            });
        });
    });
});
// == eliminar
app.delete('/:id',mdAutenticacion.verificaToken,(req, res)=>{
    // variable con los datos recibidos
    let id = req.params.id;
    // busco y elimino de la db
    Hospital.findByIdAndRemove(id,(err, hospitalEliminado)=>{
        // valido si hay algun error y los retorno
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el hospital',
                errors: err
            });
        }
        // valido si el hospital si existe
        if(!hospitalEliminado){
            return res.status(400).json({
                ok: false,
                message:'El hospital con el id "'+ id +'" no existe',
                errors: {message:"El hospital no existe"}
            })
        }
        // si todo salio bien se retornan los datos
        return res.status(200).json({
            ok: true,
            message:'Hospital eliminado exitosamente',
            data: hospitalEliminado
        });
    });
});

// **
// **** EXPORTE ****
// **
module.exports = app;