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

    Usuario.find({}, 'nombre email img rol')
        .exec(
            (err, usr) => {
                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    })
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usr
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
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El usuario con el ID: ' + id + ' no existe',
                errors: { message: 'No existe un usuario con el ID: ' + id }
            });
        } else {
            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.rol = body.rol;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: true,
                        mensaje: 'Error al actualizar usuario',
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
app.post('/', mdAuth.verificaToken, (req, res) => {

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
                mensaje: 'Error al crear usuarios',
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


app.delete('/:id', mdAuth.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al borrar usuario',
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