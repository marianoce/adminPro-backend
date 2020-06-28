// Requires
var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Login erroneo",
                errors: err
            });
        }

        if (!usuarioDB || !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Login erroneo',
                errors: err
            })
        }

        usuarioDB.password = '....';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            mensaje: 'Login correcto',
            token: token,
            id: usuarioDB.id
        });
    });
})

module.exports = app;