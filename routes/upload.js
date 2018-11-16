// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
// == Modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
// == Config
var extensionesValidas = require('../config/config').extensionesValidasImagen;
var tiposValidos = require('../config/config').tiposRutasValidasImagen;
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
// == default options
app.use(fileUpload());
// == Subir imagen
app.put('/:tipo/:id',(req, res)=>{
    // Variables recibidas
    var tipo = req.params.tipo;
    var id = req.params.id;
    // ******* ACA VALIDAR QUE EL ID SI EXISTA
    // validacion tipos validos de archivo
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            message: 'Tipo no valido',
            errors:{message:'El tipo debe ser '+tiposValidos.join(', ')}
        });
    }
    // valido que existan archivos
    if(!req.files){
        return res.status(400).json({
            ok: false,
            message: 'Falta la imagen',
            errors:{message:'Se debe seleccionar una imagen'}
        });
    }
    // obtener nombre y ext del archivo
    var archivo = req.files.imagen;
    var partes = archivo.name.split('.');
    var extArchivo = partes[partes.length - 1];
    // validacion extensiones permitidas
    if(extensionesValidas.indexOf(extArchivo) < 0){
        return res.status(400).json({
            ok: false,
            message: 'Extension no valida',
            errors:{message:'La extension de la imagen debe ser '+extensionesValidas.join(', ')}
        });
    }
    // nombre de archivo personalizado --> id-#.ext
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extArchivo }`;
    // ruta del archivo
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;
    // Mover el archivo del temporal a un path
    archivo.mv(path, err=>{
        // validacion de error
        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error al mover el archivo',
                errors: err
            });
        }
        // actualizar el archivo en la db
        subirPorTipo(tipo,id,nombreArchivo,res);
        // si todo salio correctamente retorno
        /*
        return res.status(200).json({
            ok: true,
            message: 'Archivo subido correctamente',
            data: nombreArchivo
        });
        */
    });
});

// **
// **** CONTENIDO - FUNCIONES ****
// **
// == editar imagen en el modelo
function subirPorTipo(tipo, id, nombre, res){
    // case a tipos
    switch(tipo) {
        case tiposValidos[0]:
            Usuario.findById(id,(err, usuario)=>{
                // valido si el usuario existe
                if(!usuario){
                    return res.status(400).json({
                        ok: false,
                        message:'El usuario con el id "'+ id +'" no existe',
                        errors: {message:"El usuario no existe"}
                    })
                }
                // ruta path viejo
                var pathViejo = './uploads/'+tiposValidos[0]+'/' + usuario.img;
                // si existe un archivo anterior
                if(fs.existsSync(pathViejo)){
                    // se elimina el archivo
                    fs.unlink(pathViejo);
                }
                // agrego la imagen nueva al usuario
                usuario.img = nombre;
                // guardo en la db
                usuario.save((err,usuarioActualizado)=>{
                    // si todo salio correctamente retorno
                    return res.status(200).json({
                        ok: true,
                        message: 'Imagen de usuario actualizada correctamente',
                        data: usuarioActualizado
                    });
                });
            });
            break;
        case tiposValidos[1]:
            Hospital.findById(id,(err, hospital)=>{
                // valido si el hospital existe
                if(!hospital){
                    return res.status(400).json({
                        ok: false,
                        message:'El hospital con el id "'+ id +'" no existe',
                        errors: {message:"El hospital no existe"}
                    })
                }
                // ruta path viejo
                var pathViejo = './uploads/'+tiposValidos[1]+'/' + hospital.img;
                // si existe un archivo anterior
                if(fs.existsSync(pathViejo)){
                    // se elimina el archivo
                    fs.unlink(pathViejo);
                }
                // agrego la imagen nueva al hospital
                hospital.img = nombre;
                // guardo en la db
                hospital.save((err,hospitalActualizado)=>{
                    // si todo salio correctamente retorno
                    return res.status(200).json({
                        ok: false,
                        message: 'Imagen de hospital actualizada correctamente',
                        data: hospitalActualizado
                    });
                });
            });
            
            break;
        case tiposValidos[2]:
            Medico.findById(id,(err, medico)=>{
                // valido si el medico existe
                if(!medico){
                    return res.status(400).json({
                        ok: false,
                        message:'El medico con el id "'+ id +'" no existe',
                        errors: {message:"El medico no existe"}
                    })
                }
                // ruta path viejo
                var pathViejo = './uploads/'+tiposValidos[2]+'/' + medico.img;
                // si existe un archivo anterior
                if(fs.existsSync(pathViejo)){
                    // se elimina el archivo
                    fs.unlink(pathViejo);
                }
                // agrego la imagen nueva al medico
                medico.img = nombre;
                // guardo en la db
                medico.save((err,medicoActualizado)=>{
                    // si todo salio correctamente retorno
                    return res.status(200).json({
                        ok: false,
                        message: 'Imagen de medico actualizada correctamente',
                        data: medicoActualizado
                    });
                });
            });
            break;
    }
}

// **
// **** EXPORTE ****
// **
module.exports = app;