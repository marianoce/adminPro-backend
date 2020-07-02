// Requires
var express = require('express');
var bcrypt = require('bcrypt');
var Usuario = require('../models/usuario');
var mdAuth = require('../middlewares/auth');

// Inicializar variables
var app = express();

// Rutas

// GET
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img rol')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usr) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error cargando Usuario',
                        errors: err
                    })
                }

                Usuario.count({}, (error, cont) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usr,
                        total: cont
                    })
                })
            });
});


// PUT
app.put('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El Usuario con el ID: ' + id + ' no existe',
                errors: { message: 'No existe un Usuario con el ID: ' + id }
            });
        } else {
            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.rol = body.rol;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al actualizar Usuario',
                        errors: err
                    });
                }
                usuarioGuardado.password = '....';
                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                })
            })
        }
    })
});


// POST
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        rol: body.rol
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear Usuario',
                errors: err
            })
        }

        usuarioGuardado.password = '....';

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        })
    });
});


// DELETE
app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al borrar Usuario',
                errors: err
            })
        }

        usuarioBorrado.password = '....';
        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
});


module.exports = app;