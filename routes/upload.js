// Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var fs = require('fs');


// Inicializar variables
var app = express();
app.use(fileUpload());

app.put('/:tipo/:id', function(req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error subiendo imagen'
        })
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var extensiones = archivo.name.split('.');
    var extension = extensiones[extensiones.length - 1];

    // Extensiones permitidas
    var extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida'
        })
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ extension }`;

    // Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no valido'
        })
    }

    // Mover el archivo del temporal a un path especifico
    var path = `./upload/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo'
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res)

        /*
        return res.status(200).json({
            ok: true,
            mensaje: 'Archivo subido',
            imagen: nombreArchivo
        });
        */
    });

});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })
});


function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (usuario && usuario.img) {
                var pathViejo = './upload/usuarios/' + usuario.img;
                // Si existe, elimina la imagen anterior.
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, () => {});
                }
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado,
                    pathViejo: pathViejo
                });
            })
        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (medico && medico.img) {
                var pathViejo = './upload/medicos/' + medico.img;
                // Si existe, elimina la imagen anterior.
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, () => {});
                }
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado,
                    pathViejo: pathViejo
                });
            })
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (hospital && hospital.img) {
                var pathViejo = './upload/hospitales/' + hospital.img;
                // Si existe, elimina la imagen anterior.
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, () => {});
                }
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado,
                    pathViejo: pathViejo
                });
            })
        });
    }
}

module.exports = app;