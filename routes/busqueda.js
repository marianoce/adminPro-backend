// Requires
var express = require('express');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Inicializar variables
var app = express();

// POR COLECCION
app.get('/coleccion/:tabla/:busq', (req, res, next) => {
    var busq = req.params.busq;
    var tabla = req.params.tabla;
    var reg = new RegExp(busq, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busq, reg)
            break;
        case 'medicos':
            promesa = buscarMedicos(busq, reg)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busq, reg)
            break;
        default:
            res.status(400).json({
                ok: true,
                mensaje: 'No se uso tabla: usuario, medico, hospital'
            })
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    })
});

// GENERAL
app.get('/todo/:busq', (req, res, next) => {

    var busq = req.params.busq;
    var reg = new RegExp(busq, 'i');

    Promise.all([buscarHospitales(busq, reg),
            buscarMedicos(busq, reg),
            buscarUsuarios(busq, reg)
        ])
        .then(resps => {
            res.status(200).json({
                ok: true,
                hospitales: resps[0],
                medicos: resps[1],
                usuarios: resps[2],
            })
        });
});

function buscarHospitales(busq, reg) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: reg }, (err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales');
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(busq, reg) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: reg }, (err, medicos) => {
            if (err) {
                reject('Error al cargar medicos');
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busq, reg) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email rol')
            .or([{ nombre: reg }, { email: reg }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios')
                } else {
                    resolve(usuarios);
                }
            })
    });
}

module.exports = app;