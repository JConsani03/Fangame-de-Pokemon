// - - - ELEMENTOS HTML - - -
const div_ataque_pc = document.getElementById("ataque_pc");
const div_ataque_player = document.getElementById("ataque_player");
const section_seleccion_pokemon = document.getElementById("seleccion_pokemon");
const section_seleccion_ataque = document.getElementById("seleccion_ataque");
const section_historial = document.getElementById("historial");
const btn_seleccionar = document.getElementById("b_selec");
const p_pok_player = document.getElementById("pok_player");
const p_pok_pc = document.getElementById("pok_pc");
const h2_vid_pc = document.getElementById("vid_pc");
const h2_vid_player = document.getElementById("vid_player");
const div_pokemons = document.getElementById("pokemons");
const div_botones_ataque = document.getElementById("botones_ataque");
const canva_player = document.getElementById("canva_player");
const canva_pc = document.getElementById("canva_pc");
const context_canva_player = canva_player.getContext("2d");
const context_canva_pc = canva_pc.getContext("2d");
const btn_reiniciar = document.getElementById("btn_reiniciar");
const lista_ataques = document.getElementsByName("btn");
let seleccionables;

// - - - CLASES - - -
class tipos {
    constructor(symbol, debilidades, resistencias, fortalezas) {
        this.symbol = symbol;
        this.debilidades = debilidades;
        this.resistencias = resistencias;
        this.fortalezas = fortalezas;
    }
}

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

class ataque {
    constructor(id, tipo, nombre, daño) {
        this.id = id;
        this.tipo = tipo;
        this.nombre = nombre;
        this.daño = daño;
    }
}

// - - - TIPOS - - -
const fuego = new tipos("🔥", ["💧"], ["🌱"], ["🌱"]);
const planta = new tipos("🌱", ["🔥"], ["💧"], ["💧"]);
const agua = new tipos("💧", ["🌱"], ["🔥"], ["🔥"]);

// - - - POKÉMONS - - -
const snivy = new pokemon(0, "Snivy", [planta], 500, "./img/icons/SnivyIcono.png", "./img/Snivy_XY.gif", false);
const tepig = new pokemon(1, "Tepig", [fuego], 500, "./img/icons/TepigIcono.png", "./img/Tepig_XY.gif", false);
const oshawott = new pokemon(2, "Oshawott", [agua], 500, "./img/icons/OshawottIcono.png", "./img/Oshawott_XY.gif", false);
const scovillain = new pokemon(3, "Scovillain", [planta, fuego], 500, "./img/icons/ScovillainIcono.png", "./img/120px-Scovillain_EP.gif", true);
const lotad = new pokemon(4, "Lotad", [planta, agua], 500, "./img/icons/LatodIcono.png", "./img/Lotad_XY.gif", true);
const volcanion = new pokemon(5, "Volcanion", [agua, fuego], 500, "./img/icons/VolcanionIcono.png", "./img/Volcanion_XY.gif", true);

const pokedex = [snivy, tepig, oshawott, scovillain, lotad, volcanion];

// - - - ATAQUES - - -
const gigadrenado = new ataque(0, planta, "Gigadrenado", 50);
const llamarada = new ataque(0, fuego, "Llamarada", 50);
const hidropulso = new ataque(0, agua, "Hidropulso", 50);

const ataques_agua = [hidropulso];
const ataques_fuego = [llamarada];
const ataques_planta = [gigadrenado];

// - - - VARIABLES Y CONSTANTES - - -
const jugador = 0;
const pc = 1;
let pokemon_select = [0, 0];
let turno = 1;

function random(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1) + min);
    return num;
}

function switchDisplay() {
    if (section_seleccion_pokemon.style.display == "block") {
        section_seleccion_ataque.style.display = "block";
        section_historial.style.display = "flex";
        section_seleccion_pokemon.style.display = "none";
    } else {
        section_seleccion_pokemon.style.display = "block";
        section_seleccion_ataque.style.display = "none";
        section_historial.style.display = "none";
    }
}

function reiniciar() {
    turno = 1;
    eliminarBotonesAtaque();
    switchDisplay();
    btn_reiniciar.style.display = "none";
    p_pok_player.removeChild(p_pok_player.lastChild);
    p_pok_pc.removeChild(p_pok_pc.lastChild);
}

function limpiarHistorial() {
    div_ataque_pc.innerHTML = "";
    div_ataque_player.innerHTML = "";
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
            }
        }
    } else {
        for (let i = 0; i < ataque.tipo.fortalezas.length; i++) {
            danio = comprobarDebilidad(ataque, objetivo, 0, i);
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

    if((fuerte > 1) && (debil == 0)){
        damage = fuerte;
    } else if((fuerte == 0) && (debil >= 0.25)){
        damage = debil;
    }

    return ataque.daño * damage;
}

function listarPokemonsSeleccionables() {
    seleccionables = document.getElementsByName("pokemon");
    return (seleccionables.length);
}

function seleccionarAtaquePC() {
    if (pokemon_select[pc].hasSecondType) {
        let ataques = [listarAtaques(pokemon_select[pc].tiposP[0].symbol), listarAtaques(pokemon_select[pc].tiposP[1].symbol)];
        let ran = random(0, 1);
        return ataques[ran][random(0, (ataques[ran].length - 1))]
    } else {
        let ataques = listarAtaques(pokemon_select[pc].tiposP[0].symbol);
        return ataques[random(0, (ataques.length - 1))];
    }
}

function listarAtaques(tipo) {
    if (tipo == "🔥") {
        return ataques_fuego;
    } else if (tipo == "💧") {
        return ataques_agua;
    } else if (tipo == "🌱") {
        return ataques_planta;
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
    pokedex.forEach(function (pokemon) {
        let id = listarPokemonsSeleccionables();
        let ficha = `<input type="radio" name="pokemon" id=${id} data-pokedex=${pokemon.id} />
        <label for=${id}>
            <p>${(pokemon.hasSecondType == false ? pokemon.tiposP[0].symbol : pokemon.tiposP[0].symbol + pokemon.tiposP[1].symbol)} ${pokemon.nombre}</p>
            <img id=${pokemon.nombre} src=${pokemon.gif} alt=${pokemon.nombre}>
        </label>`;
        div_pokemons.innerHTML += ficha;
    })
}

function actualizarCanvas(){
    porcent_pc = pokemon_select[pc].vidas / 500;
    porcent_player = pokemon_select[jugador].vidas / 500;

    context_canva_pc.clearRect(0, 0, canva_pc.width, canva_pc.height);
    context_canva_player.clearRect(0, 0, canva_player.width, canva_player.height);

    context_canva_pc.fillRect(0, 0, canva_pc.width * porcent_pc, canva_pc.height);
    context_canva_player.fillRect(0, 0, canva_player.width * porcent_player, canva_player.height);
}

function restarVida(dañoPC, dañoPlayer) {
    pokemon_select[jugador].vidas -= dañoPC;
    pokemon_select[pc].vidas -= dañoPlayer;
    h2_vid_pc.innerHTML = pokemon_select[pc].vidas;
    h2_vid_player.innerHTML = pokemon_select[jugador].vidas;
    actualizarCanvas();
}

function actualizarHistorial(turno, ataqueJugador, ataquePC) {
    const aux1 = document.createElement("p");
    aux1.innerHTML = turno + ". " + ataqueJugador;
    div_ataque_player.appendChild(aux1);

    const aux2 = document.createElement("p");
    aux2.innerHTML = turno + ". " + ataquePC;
    div_ataque_pc.appendChild(aux2);
}

function finalizarPelea(){
    lista_ataques.forEach(function (boton){
        boton.disabled = true;
    });
    btn_reiniciar.style.display = "block";
    pokemon_select[pc].vidas <= 0 ? h2_vid_pc.innerHTML = "0" : h2_vid_player.innerHTML = "0";
}

// - - - PELEA - - -
function pelear(btn) {
    let ataque_PC = seleccionarAtaquePC();
    let ataque_Player = listarAtaques(btn.target.id)[btn.target.dataset.ataque];

    let danio_pc = calcularDanio(ataque_PC, pokemon_select[jugador]);
    let danio_player = calcularDanio(ataque_Player, pokemon_select[pc]);

    restarVida(danio_pc, danio_player);
    actualizarHistorial(turno++, ataque_Player.tipo.symbol, ataque_PC.tipo.symbol);

    if (pokemon_select[pc].vidas <= 0 && pokemon_select[jugador].vidas <= 0) {
        alert("¡EMPATE!");
        finalizarPelea();
    } else if(pokemon_select[pc].vidas <= 0 || pokemon_select[jugador].vidas <= 0){
        alert((pokemon_select[pc].vidas <= 0 ? "¡GANASTE" : "¡PERDISTE") + " EL JUEGO!");
        finalizarPelea();
    }
}

// - - - SELECCIÓN DE POKÉMON - - -
function seleccionarPokemons() {
    let aux = 0;
    let icon_pc = new Image();
    let icon_player = new Image();

    seleccionables.forEach(function (radio) {
        if (radio.checked) {

            //Jugador
            let pok_reference = pokedex[radio.dataset.pokedex];
            pokemon_select[jugador] = new pokemon(pok_reference.id, pok_reference.nombre, 
                                                pok_reference.tiposP, pok_reference.vidas, 
                                                pok_reference.icono, pok_reference.gif, pok_reference.hasSecondType);
            icon_player.src = pokemon_select[jugador].icono;
            p_pok_player.appendChild(icon_player);
            if (pokemon_select[jugador].hasSecondType) {
                crearBotonesAtaque(listarAtaques(pokemon_select[jugador].tiposP[0].symbol));
                crearBotonesAtaque(listarAtaques(pokemon_select[jugador].tiposP[1].symbol));
            } else {
                crearBotonesAtaque(listarAtaques(pokemon_select[jugador].tiposP[0].symbol));
            }
            alert("Elegiste a " + pokemon_select[jugador].nombre);

            //PC
            pok_reference = pokedex[random(0, (pokedex.length - 1))];
            pokemon_select[pc] = new pokemon(pok_reference.id, pok_reference.nombre, 
                                            pok_reference.tiposP, pok_reference.vidas, 
                                            pok_reference.icono, pok_reference.gif, pok_reference.hasSecondType);
            icon_pc.src = pokemon_select[pc].icono;
            p_pok_pc.appendChild(icon_pc);
            alert("La PC eligió a " + pokemon_select[pc].nombre);

            h2_vid_pc.innerHTML = pokemon_select[pc].vidas;
            h2_vid_player.innerHTML = pokemon_select[jugador].vidas;
            context_canva_pc.fillStyle = "green";
            context_canva_player.fillStyle = "green";
            context_canva_pc.fillRect(0, 0, canva_pc.width, canva_pc.height);
            context_canva_player.fillRect(0, 0, canva_player.width, canva_player.height);

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