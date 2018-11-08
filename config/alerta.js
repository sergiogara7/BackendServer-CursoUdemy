var alerta = {
    errorCarga: function(campo = 'registros'){
        return 'error cargando los ' + campo;
    },
    errorExiste: function(campo = 'registro22'){
        // message:'El usuario con el id "'+ id +'" no existe',
        return 'el ' + campo + ' no existe';
    },
    errorEditar: function(campo = 'registro'){
        return 'Error al editar el ' + campo;
    },
    errorCrear: function(campo = "registro"){
        return 'Error al crear el ' + campo;
    },
    confirmacionRegistros: function(campo = 'registros'){
        return 'lista de ' + campo;
    },
    confirmacionCrear: function(campo = 'registro'){
        return campo + ' creado exitosamente';
    },
    confirmacionEditar: function(campo = 'registro'){
        return campo + ' editado exitosamente';
    },
    confirmacionEliminar: function(campo = 'registro'){
        return campo + ' eliminado exitosamente';
    }
}
module.exports = alerta;