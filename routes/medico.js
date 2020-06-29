// Requires
var express = require('express');
var Medico = require('../models/medico');
var mdAuth = require('../middlewares/auth');


// Inicializar variables
var app = express();


// Rutas

// GET
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, med) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error cargando Medicos',
                        errors: err
                    })
                }

                Medico.count({}, (error, cont) => {
                    res.status(200).json({
                        ok: true,
                        medicos: med,
                        total: cont
                    })
                })
            });
});


// PUT
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar Medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El Medico con el ID: ' + id + ' no existe',
                errors: { message: 'No existe un Medico con el ID: ' + id }
            });
        } else {
            medico.nombre = body.nombre;
            //medico.hospital = body.hospital;
            //hospital.usuario = body.usuario;

            medico.save((err, medicoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al actualizar Medico',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    medico: medicoGuardado
                })
            })
        }
    })
});


// POST
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear Medico',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        })
    });
});

// DELETE
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al borrar Medico',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            medico: medicoBorrado
        })
    });
});


module.exports = app;