// **
// **** REQUIRES ****
// **
// == Requires
var express = require('express');
// == Modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
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
// == listar todo
app.get('/todo/:busqueda',(req, res)=>{
    // variable texto
    let texto = req.params.busqueda;
    // Expresion regular para buscar 
    let regex = new RegExp(texto,'i');
    // obtener de la db
    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ]).then(respuestas=>{
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});
// == Listar por coleccion
app.get('/coleccion/:tabla/:busqueda',(req, res)=>{
    // variables recibidas
    let tabla = req.params.tabla;
    let texto = req.params.busqueda;
    // Expresion regular para buscar 
    let regex = new RegExp(texto,'i');
    // variable que almacenara
    var promesa
    // case e datablas
    switch(tabla) {
        case 'hospitales':
            promesa = buscarHospitales(regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                message: 'Error al buscar la tabla',
                erros :{message:'Nombre de tabla no valido'}
            });
    }
    // return
    promesa.then(registros=>{
        res.status(200).json({
            ok: true,
            //data: registros,
            [tabla]: registros
        });
    });
});

// **
// **** CONTENIDO - FUNCIONES ****
// **
// == Buscar Hospitales
function buscarHospitales(regex){
    return new Promise((resolve,reject)=>{
        Hospital.find({ nombre: regex }).populate('usuario','nombre apellido').exec((err,hospitales)=>{
            if(err){
                reject('Error al cargar hospitales',err);
            }else{
                resolve(hospitales);
            }
        });
    });
}
// == Buscar Medico
function buscarMedicos(regex){
    return new Promise((resolve,reject)=>{
        Medico.find({ nombre: regex }).populate('usuario','nombre apellido').populate('hospital','nombre').exec((err,medicos)=>{
            if(err){
                reject('Error al cargar medicos',err);
            }else{
                resolve(medicos);
            }
        });
    });
}
// == Buscar Usuario
function buscarUsuarios(regex){
    return new Promise((resolve,reject)=>{
        Usuario.find({},'nombre apellido correo rol google img').or([{'nombre': regex},{'correo':regex}]).exec((err,usuarios)=>{
            if(err){
                reject('Error al cargar usuarios',err);
            }else{
                resolve(usuarios);
            }
        });
    });
}

// **
// **** EXPORTE ****
// **
module.exports = app;