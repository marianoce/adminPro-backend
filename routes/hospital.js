// Requires
var express = require('express');
var Hospital = require('../models/hospital');
var mdAuth = require('../middlewares/auth');

// Inicializar variables
var app = express();

// Rutas


// GET
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hosp) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error cargando Hospitales',
                        errors: err
                    })
                }

                Hospital.count({}, (error, cont) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: hosp,
                        total: cont
                    })
                });
            });
});


// PUT
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar Hospitales',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El Hospital con el ID: ' + id + ' no existe',
                errors: { message: 'No existe un Hospital con el ID: ' + id }
            });
        } else {
            hospital.nombre = body.nombre;
            //hospital.usuario = body.usuario;

            hospital.save((err, hospitalGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al actualizar Hospital',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    hospital: hospitalGuardado
                })
            })
        }
    })
});


// POST
app.post('/', mdAuth.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear Hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        })
    });
});

// DELETE
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al borrar Hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalBorrado
        })
    });
});


module.exports = app;