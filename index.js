class jugador {
    constructor(id, pokemon, disponible, id_enemigo, ataque) {
        this.id = id;
        this.pokemon = pokemon;
        this.disponible = disponible;
        this.id_enemigo = id_enemigo;
        this.ataque = ataque;
    }
}
let jugadores = [];

const cors = require('cors');
const express = require('express');
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static(__dirname));

function idAleatorio() {
    let id = '#';
    let letras = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ"

    for (let i = 0; i < 6; i++) {
        let decision = Math.round(Math.random());

        if (decision == 1) {
            id += letras[Math.floor(Math.random() * 52)];
        } else {
            id += Math.floor(Math.random() * 10).toString();
        }
    }

    return id;
}

server.get('/reiniciar-ataque/:id', function (req, res){
    let indice_cliente = jugadores.findIndex((jug) => jug.id == req.params.id);
    jugadores[indice_cliente].ataque.id = -1;
    jugadores[indice_cliente].ataque.tipo = -1;
    res.send('Clear!');
});

server.get('/solicitar-ataque/:id/:ataque/:tipo', function (req, res){
    let id_cliente = req.params.id;
    let id_ataque = req.params.ataque;
    let tipo_ataque = req.params.tipo;
    console.log(id_cliente, id_ataque, tipo_ataque);

    let indice_cliente = jugadores.findIndex((jug) => jug.id == id_cliente);
    let indice_enemigo = jugadores.findIndex((jug) => jug.id_enemigo == id_cliente && jug.id != id_cliente);
    console.log(id_cliente, id_ataque, tipo_ataque, jugadores[indice_enemigo].id);

    console.log(jugadores[indice_cliente].ataque.id, jugadores[indice_enemigo].ataque.id);

    if(jugadores[indice_cliente].ataque.id == -1){
        jugadores[indice_cliente].ataque.id = id_ataque;
        jugadores[indice_cliente].ataque.tipo = tipo_ataque;
        res.send({
            res: 'none',
            ataque: 'none'
        });
    } else if(jugadores[indice_enemigo].ataque.id != -1){
        res.send({
            res: 'ok',
            ataque: jugadores[indice_enemigo].ataque
        });
    } else {
        res.send({
            res: 'none',
            ataque: 'none'
        });
    }
});

server.post('/comprobar-online', function (req, res) {
    let id_cliente = req.body.id;
    let indice_cliente = jugadores.findIndex((jug) => jug.id == id_cliente);
    let indice_enemigo = jugadores.findIndex((jug) => jug.id_enemigo == id_cliente && jug.id != id_cliente);
    let enemigo_disponible = jugadores.findIndex((jug) => jug.disponible == true && jug.id != id_cliente);
    console.log(`indice-cliente: ${indice_cliente}, indice_enemigo: ${indice_enemigo}, enemigo_disponible: ${enemigo_disponible}`);


    if(indice_enemigo != -1){
        jugadores[indice_cliente].id_enemigo = jugadores[indice_enemigo].id;
        jugadores[indice_cliente].disponible = false;
        res.send(
            {
                res: 'ok',
                enemigo: 
                {
                    id: jugadores[indice_enemigo].id,
                    pokemon: jugadores[indice_enemigo].pokemon
                }
            }
        );
    } else if(enemigo_disponible != -1){
        jugadores[indice_cliente].id_enemigo = jugadores[enemigo_disponible].id;
        jugadores[indice_cliente].disponible = false;
        res.send(
            {
                res: 'ok',
                enemigo: 
                {
                    id: jugadores[enemigo_disponible].id,
                    pokemon: jugadores[enemigo_disponible].pokemon
                }
            }
        );
    } else {
        res.send(
            {
                res: 'none',
                enemigo: 
                {
                    id: '',
                    pokemon: ''
                }
            }
        );
    }
});

server.post('/pok', function (req, res) {
    let id = req.body.id_jug;
    let pokemon = req.body.pokemon;

    let index = jugadores.findIndex(function (jugador) {
        return jugador.id == id;
    });

    jugadores[index].pokemon = pokemon;

    console.log(jugadores);
    res.send('ok')
});

server.get('/user', function (req, res) {
    let id = '#000000';
    let existe = false;

    do {
        id = idAleatorio();
        existe = ((jugadores.findIndex((value) => value == id) != -1) ? true : false);
    } while (existe);

    const aux = new jugador(id, 0, true, '?', {id: -1, tipo: -1});
    jugadores.push(aux);

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`${id}`);
});

server.use((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Recurso no encontrado.');
});

server.listen(8080, function () {
    console.log("Server-OK");
});