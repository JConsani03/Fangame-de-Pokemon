const btn_seleccionar = document.getElementById("b_selec");
const p_pok_player = document.getElementById("pok_player");
const p_pok_pc = document.getElementById("pok_pc");
const h2_vid_pc = document.getElementById("vid_pc");
const h2_vid_player = document.getElementById("vid_player");
const div_pokemons = document.getElementById("pokemons");
const div_botones_ataque = document.getElementById("botones_ataque");
let seleccionables;

class tipos {
    constructor(symbol, debilidades, resistencias, fortalezas) {
        this.symbol = symbol;
        this.debilidades = debilidades;
        this.resistencias = resistencias;
        this.fortalezas = fortalezas;
    }
}

const fuego = new tipos("🔥", ["💧"], ["🌱"], ["🌱"]);
const planta = new tipos("🌱", ["🔥"], ["💧"], ["💧"]);
const agua = new tipos("💧", ["🌱"], ["🔥"], ["🔥"]);

class pokemon {
    constructor(id, nombre, tiposP, vidas, icono, gif, hasSecondType) {
        this.id = id;
        this.nombre = nombre;
        this.tiposP = tiposP;
        this.vidas = vidas;
        this.icono = icono;
        this.gif = gif;
        this.hasSecondType = hasSecondType;
    }
}

const snivy = new pokemon(0, "Snivy", [planta], 500, "img/icons/SnivyIcono.png", "img/Snivy_XY.gif", false);
const tepig = new pokemon(1, "Tepig", [fuego], 500, "img/icons/TepigIcono.png", "img/Tepig_XY.gif", false);
const oshawott = new pokemon(2, "Oshawott", [agua], 500, "img/icons/OshawottIcono.png", "img/Oshawott_XY.gif", false);
const scovillain = new pokemon(3, "Scovillain", [planta, fuego], 500, "img/icons/ScovillainIcono.png", "img/120px-Scovillain_EP.gif", true);
const lotad = new pokemon(4, "Lotad", [planta, agua], 500, "img/icons/LatodIcono.png", "img/Lotad_XY.gif", true);
const volcanion = new pokemon(5, "Volcanion", [agua, fuego], 500, "img/icons/VolcanionIcono.png", "img/Volcanion_XY.gif", true);

const pokemons = [snivy, tepig, oshawott, scovillain, lotad, volcanion];

class ataque {
    constructor(id, tipo, nombre, daño) {
        this.id = id;
        this.tipo = tipo;
        this.nombre = nombre;
        this.daño = daño;
    }
}

const gigadrenado = new ataque(0, planta, "Gigadrenado", 50);
const llamarada = new ataque(0, fuego, "Llamarada", 50);
const hidropulso = new ataque(0, agua, "Hidropulso", 50);

const ataquesAgua = [hidropulso];
const ataquesFuego = [llamarada];
const ataquesPlanta = [gigadrenado];

const jugador = 0;
const pc = 1;
let pokemonSelect = [0, 0];
let turno = 1;

function random(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1) + min);
    return num;
}

function switchDisplay() {
    if (document.getElementById("seleccion_pokemon").style.display == "block") {
        document.getElementById("seleccion_ataque").style.display = "block";
        document.getElementById("historial").style.display = "flex";
        document.getElementById("seleccion_pokemon").style.display = "none"
    } else {
        document.getElementById("seleccion_pokemon").style.display = "block"
        document.getElementById("seleccion_ataque").style.display = "none";
        document.getElementById("historial").style.display = "none";
    }
}

function reiniciar() {
    turno = 1;
    pokemons[pokemonSelect[jugador]].vidas = 500;
    pokemons[pokemonSelect[pc]].vidas = 500;
    pokemonSelect[jugador] = 0;
    pokemonSelect[pc] = 0;
    eliminarBotonesAtaque();
    switchDisplay();
    p_pok_player.removeChild(p_pok_player.lastChild);
    p_pok_pc.removeChild(p_pok_pc.lastChild);
}

function limpiarHistorial() {
    const hijoPC = document.getElementById("ataquePC");
    const hijoPlayer = document.getElementById("ataquePlayer");
    hijoPC.innerHTML = "";
    hijoPlayer.innerHTML = "";
}

function comprobarDebilidad(ataque, objetivo, j, i){
    let danio = 0;
    if(ataque.tipo.debilidades[i] == objetivo.tiposP[j].symbol){
        danio = 0.25;
    }
    return danio;
}

function esDebil(ataque, objetivo) {
    let danio = 0;

    if (objetivo.hasSecondType) {
        for(let j = 0; j < 2; j++){
            for (let i = 0; i < ataque.tipo.debilidades.length; i++) {
                danio += comprobarDebilidad(ataque, objetivo, j, i);
                console.log(`ataque:${ataque.nombre}, objetivo:${objetivo.nombre}, j:${j}, i:${i}, debilidades: ${ataque.tipo.debilidades.length}`);
            }
        }
    } else {
        for (let i = 0; i < ataque.tipo.fortalezas.length; i++) {
            danio = comprobarDebilidad(ataque, objetivo, 0, i);
            console.log(`ataque:${ataque.nombre}, objetivo:${objetivo.nombre}, i:${i}, debilidades: ${ataque.tipo.debilidades.length}`);
        }
    }

    return danio;
}

function comprobarFortaleza(ataque, objetivo, j, i){
    let danio = 0;
    if(ataque.tipo.fortalezas[i] == objetivo.tiposP[j].symbol){
        danio = 2;
    }
    return danio;
}

function esFuerte(ataque, objetivo) {
    let danio = 0;

    if (objetivo.hasSecondType) {
        for(let j = 0; j < 2; j++){
            for (let i = 0; i < ataque.tipo.fortalezas.length; i++) {
                danio += comprobarFortaleza(ataque, objetivo, j, i);
                console.log(`ataque:${ataque.nombre}, objetivo:${objetivo.nombre}, j:${j}, i:${i}`);
            }
        }
    } else {
        for (let i = 0; i < ataque.tipo.fortalezas.length; i++) {
            danio = comprobarFortaleza(ataque, objetivo, 0, i);
        }
    }
    return danio;
}

function calcularDanio(ataque, objetivo) {
    let damage = 1;
    let debil = esDebil(ataque, objetivo);
    let fuerte = esFuerte(ataque, objetivo);
    console.log(`debil:${debil}`);
    console.log(`fuerte:${fuerte}`);

    if((fuerte > 1) && (debil == 0)){
        damage = fuerte;
    } else if((fuerte == 0) && (debil >= 0.25)){
        damage = debil;
    }
    console.log(`&&&&&&&&&&&&&&&&&&&&&&&&&&&&`);
    console.log(`multiplicador: ${damage}`);
    console.log(`&&&&&&&&&&&&&&&&&&&&&&&&&&&&`);

    return ataque.daño * damage;
}

function listarPokemonsSeleccionables() {
    seleccionables = document.getElementsByName("pokemon");
    return (seleccionables.length);
}

function seleccionarAtaquePC() {
    if (pokemons[pokemonSelect[pc]].hasSecondType) {
        let ataques = [listarAtaques(pokemons[pokemonSelect[pc]].tiposP[0].symbol), listarAtaques(pokemons[pokemonSelect[pc]].tiposP[1].symbol)];
        let ran = random(0, 1);
        return ataques[ran][random(0, (ataques[ran].length - 1))]
    } else {
        let ataques = listarAtaques(pokemons[pokemonSelect[pc]].tiposP[0].symbol);
        return ataques[random(0, (ataques.length - 1))];
    }
}

function listarAtaques(tipo) {
    if (tipo == "🔥") {
        return ataquesFuego;
    } else if (tipo == "💧") {
        return ataquesAgua;
    } else if (tipo == "🌱") {
        return ataquesPlanta;
    }
}

function eliminarBotonesAtaque(){
    div_botones_ataque.innerHTML = "";
}

function crearBotonesAtaque(arrayAtaques) {
    arrayAtaques.forEach(function (ataque) {
        let btn = `<button id=${ataque.tipo.symbol} name="btn" data-ataque=${ataque.id}>${ataque.nombre}</button>`;
        div_botones_ataque.innerHTML += btn;
    });
    document.getElementsByName("btn").forEach(function (btn) {
        btn.addEventListener("click", pelear);
    });
}

function crearFichasPokemon() {
    pokemons.forEach(function (pokemon) {
        let id = listarPokemonsSeleccionables();
        let ficha = `<input type="radio" name="pokemon" id=${id} data-pokedex=${pokemon.id} />
        <label for=${id}>
            <p>${(pokemon.hasSecondType == false ? pokemon.tiposP[0].symbol : pokemon.tiposP[0].symbol + pokemon.tiposP[1].symbol)} ${pokemon.nombre}</p>
            <img id=${pokemon.nombre} src=${pokemon.gif} alt=${pokemon.nombre}>
        </label>`;
        div_pokemons.innerHTML += ficha;
    })
}

function restarVida(dañoPC, dañoPlayer) {
    pokemons[pokemonSelect[jugador]].vidas -= dañoPC;
    pokemons[pokemonSelect[pc]].vidas -= dañoPlayer;
    h2_vid_pc.innerHTML = pokemons[pokemonSelect[pc]].vidas;
    h2_vid_player.innerHTML = pokemons[pokemonSelect[jugador]].vidas;
}

function actualizarHistorial(turno, ataqueJugador, ataquePC) {
    const aux1 = document.createElement("p");
    aux1.innerHTML = turno + ". " + ataqueJugador;
    document.getElementById("ataquePlayer").appendChild(aux1);

    const aux2 = document.createElement("p");
    aux2.innerHTML = turno + ". " + ataquePC;
    document.getElementById("ataquePC").appendChild(aux2);
}

// - - - PELEA - - -
function pelear(btn) {
    let ataque_PC = seleccionarAtaquePC();
    let ataque_Player = listarAtaques(btn.target.id)[btn.target.dataset.ataque];

    let dañoPC = calcularDanio(ataque_PC, pokemons[pokemonSelect[jugador]]);
    console.log(".............")
    let dañoPlayer = calcularDanio(ataque_Player, pokemons[pokemonSelect[pc]]);

    restarVida(dañoPC, dañoPlayer);

    if (pokemons[pokemonSelect[pc]].vidas <= 0 && pokemons[pokemonSelect[jugador]].vidas <= 0) {
        alert("¡EMPATE!");
        reiniciar()
    } else if(pokemons[pokemonSelect[pc]].vidas <= 0 || pokemons[pokemonSelect[jugador]].vidas <= 0){
        alert((pokemons[pokemonSelect[pc]].vidas <= 0 ? "¡GANASTE" : "¡PERDISTE") + " EL JUEGO!");
        reiniciar()
    }
}

// - - - SELECCIÓN DE POKÉMON - - -
function seleccionarPokemons() {
    let aux = 0;
    let iconPC = new Image();
    let iconPlayer = new Image();

    seleccionables.forEach(function (radio) {
        if (radio.checked) {

            //Jugador
            pokemonSelect[jugador] = radio.dataset.pokedex;
            iconPlayer.src = pokemons[pokemonSelect[jugador]].icono;
            p_pok_player.appendChild(iconPlayer);
            if (pokemons[pokemonSelect[jugador]].hasSecondType) {
                crearBotonesAtaque(listarAtaques(pokemons[pokemonSelect[jugador]].tiposP[0].symbol));
                crearBotonesAtaque(listarAtaques(pokemons[pokemonSelect[jugador]].tiposP[1].symbol));
            } else {
                crearBotonesAtaque(listarAtaques(pokemons[pokemonSelect[jugador]].tiposP[0].symbol));
            }
            alert("Elegiste a " + pokemons[pokemonSelect[jugador]].nombre);

            //PC
            pokemonSelect[pc] = random(0, pokemons.length - 1);
            iconPC.src = pokemons[pokemonSelect[pc]].icono;
            p_pok_pc.appendChild(iconPC);
            alert("La PC eligió a " + pokemons[pokemonSelect[pc]].nombre);

            h2_vid_pc.innerHTML = pokemons[pokemonSelect[pc]].vidas;
            h2_vid_player.innerHTML = pokemons[pokemonSelect[jugador]].vidas;
            limpiarHistorial();
            switchDisplay();

        } else {
            aux++;
        }
    });
    if (aux == seleccionables.length) alert("¡Selecciona algún pokémon!");
}

crearFichasPokemon();
switchDisplay();
btn_seleccionar.addEventListener("click", seleccionarPokemons);