var response = {
    status200: function(res, mensaje, datos){
        return res.status(200).json({
            ok: true,
            message: mensaje,
            data: datos
        });
    },
    status201: function(res, mensaje, datos){
        return res.status(201).json({
            ok: true,
            message: mensaje,
            data: datos
        });
    },
    status500: function(res, mensaje, errores){
        if(errores){
            return res.status(500).json({
                ok: false,
                message: mensaje,
                errors: errores
            });
        }
    },
    status400: function(res, mensaje, errores){
        if(errores){
            return res.status(400).json({
                ok: false,
                message: mensaje,
                errors: errores
            });
        }
    }
}
module.exports = response;