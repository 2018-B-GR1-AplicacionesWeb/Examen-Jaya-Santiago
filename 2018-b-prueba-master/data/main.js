const inquirer = require('inquirer');
const fs = require('fs');
const rxjs = require('rxjs');
const mergeMap = require('rxjs/operators').mergeMap;
const map = require('rxjs/operators').map;
const preguntaMenu = {
    type: 'list',
    name: 'opcionesMenu',
    message: 'Que dese buscar:?????',
    choices: [
        '1. buscar gender',
        '2. buscar eye color',
        '3. buscar skin color',
        '4. buscar hair color',
    ]
};
const preguntaUsuario = [
    {
        type: 'input',
        name: 'gender',
        message: 'Cual es tu gender'
    },
    {
        type: 'input',
        name: 'eye_color',
        message: 'Cual es tu eye_color'
    },
    {
        type: 'input',
        name: ' skin_color',
        message: 'Cual es tu skin_color'
    },
    {
        type: 'input',
        name: 'hair_color',
        message: 'Cual es tu hair_color'
    },
];
const preguntaUsuarioBusquedaGender = [
    {
        type: 'input',
        name: 'nombre',
        message: 'Escribe el gender a buscar'
    }
];

const preguntaUsuarioBusquedaPorEyeColor = [
    {
        type: 'input',
        name: 'nombre',
        message: 'Escribe el eye color a buscar a buscar'
    }
];

const preguntaUsuarioBusquedaPorSkinColor = [
    {
        type: 'input',
        name: 'nombre',
        message: 'Escribe el skin color a buscar'
    }
];

const preguntaUsuarioBusquedaPorHairColor = [
    {
        type: 'input',
        name: 'nombre',
        message: 'Escribe el eye color a buscar'
    }

];
function main() {
            mergeMap((respuesta) => {
                console.log(respuesta);
                switch (respuesta.respuestaUsuario.opcionMenu) {
                    case 'Crear':
                        return rxjs
                            .from(inquirer.prompt(preguntaUsuario))
                            .pipe(map((usuario) => {
                                respuesta.usuario = usuario;
                                return respuesta;
                            }));
                    default:
                        respuesta.usuario = {
                            id: null,
                            nombre: null
                        };
                        rxjs.of(respuesta);
                }
            }), // Ejecutar Accion
            map((respuesta) => {
                console.log('respuesta en accion', respuesta);
                switch (respuesta.respuestaUsuario.opcionMenu) {
                    case 'Buscar':
                        const usuario = respuesta.usuario;
                        respuesta.respuestaBDD.bdd.usuarios.push(usuario);
                        return respuesta;
                }
            })

        .subscribe((mensaje) => {
            console.log(mensaje);
        }, (error) => {
            console.log(error);
        }, () => {
            console.log('encontrado');
            main();
        });
}
function preguntarMenu() {
    return rxjs.from(inquirer.prompt(preguntaMenu));
}
function leerBDD() {
    return new Promise((resolve) => {
        fs.readFile('bdd.json', 'utf-8', (error, contenidoLeido) => {
            if (error) {
                resolve({
                    mensaje: 'No se encontro',
                    bdd: null
                });
            }
            else {
                resolve({
                    mensaje: 'Encontrado',
                    bdd: JSON.parse(contenidoLeido)
                });
            }
        });
    });
}

function buscarUsuarioEyeColor(nombre) {
    return new Promise((resolve, reject) => {
        fs.readFile('bdd.json', 'utf-8', (err, contenido) => {
            if (err) {
                reject({ mensaje: 'error' });
            }
            else {
                const bdd = JSON.parse(contenido);
                const respuestaFind = bdd.usuarios
                    .find((usuario) => {
                        return usuario.nombre === nombre;
                    });
                resolve(respuestaFind);
            }
        });
    });
}
main();