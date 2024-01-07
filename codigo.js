const btn_seleccionar = document.getElementById("b_selec");
const p_pok_player = document.getElementById("pok_player");
const p_pok_pc = document.getElementById("pok_pc");
const h2_vid_pc = document.getElementById("vid_pc");
const h2_vid_player = document.getElementById("vid_player");
const div_pokemons = document.getElementById("pokemons");
let seleccionables;

class pokemon {
    constructor(id, nombre, tipos, vidas, icono, gif, hasSecondType) {
        this.id = id;
        this.nombre = nombre;
        this.tipos = tipos;
        this.vidas = vidas;
        this.icono = icono;
        this.gif = gif;
        this.hasSecondType = hasSecondType;
    }
}

let snivy = new pokemon(0, "Snivy", ["🌱"], 3, "img/icons/SnivyIcono.png", "img/Snivy_XY.gif", false);
let tepig = new pokemon(1, "Tepig", ["🔥"], 3, "img/icons/TepigIcono.png", "img/Tepig_XY.gif", false);
let oshawott = new pokemon(2, "Oshawott", ["💧"], 3, "img/icons/OshawottIcono.png", "img/Oshawott_XY.gif", false);
let scovillain = new pokemon(3, "Scovillain", ["🌱", "🔥"], 3, "img/icons/ScovillainIcono.png", "img/120px-Scovillain_EP.gif", true);
let lotad = new pokemon(4, "Lotad", ["🌱", "💧"], 3, "img/icons/LatodIcono.png", "img/Lotad_XY.gif", true);
let volcanion = new pokemon(5, "Volcanion", ["💧", "🔥"], 3, "img/icons/VolcanionIcono.png", "img/Volcanion_XY.gif", true);

let pokemons = [snivy, tepig, oshawott, scovillain, lotad, volcanion];

const jugador = 0;
const pc = 1;
let pokemonSelect = [0, 0];
let turno = 1;

function actualizarSeleccionables(){
    seleccionables = document.getElementsByName("pokemon");
    return (seleccionables.length);
}

function crearFichasPokemon() {
    pokemons.forEach(function (pokemon) {
        let id = actualizarSeleccionables();
        let ficha = `<input type="radio" name="pokemon" id=${id} data-pokedex=${pokemon.id} />
        <label for=${id}>
            <p>${(pokemon.hasSecondType == false ? pokemon.tipos[0] : pokemon.tipos[0] + pokemon.tipos[1])} ${pokemon.nombre}</p>
            <img id=${pokemon.nombre} src=${pokemon.gif} alt=${pokemon.nombre}>
        </label>`;
        div_pokemons.innerHTML += ficha;
    })
}

function limpiarHistorial() {
    const hijoPC = document.getElementById("ataquePC");
    const hijoPlayer = document.getElementById("ataquePlayer");
    while (hijoPC.firstChild != null && hijoPlayer.firstChild != null) {
        hijoPC.removeChild(hijoPC.firstChild);
        hijoPlayer.removeChild(hijoPlayer.firstChild);
    }
}

function switchDisplay() {
    if (document.getElementById("seleccion-pokemon").style.display == "block") {
        document.getElementById("seleccion-ataque").style.display = "block";
        document.getElementById("historial").style.display = "flex";
        document.getElementById("seleccion-pokemon").style.display = "none"
    } else {
        document.getElementById("seleccion-pokemon").style.display = "block"
        document.getElementById("seleccion-ataque").style.display = "none";
        document.getElementById("historial").style.display = "none";
    }
}

function desactivarBtn() {
    document.getElementsByName("btn").forEach(function (btn) {
        btn.disabled = true;
    });
}

function restarVida(objetivo) {
    if (objetivo == jugador) {
        pokemons[pokemonSelect[jugador]].vidas--;
    } else if (objetivo == 1) {
        pokemons[pokemonSelect[pc]].vidas--;
    }
    h2_vid_pc.innerHTML = pokemons[pokemonSelect[pc]].vidas;
    h2_vid_player.innerHTML = pokemons[pokemonSelect[jugador]].vidas;
}

function reiniciar() {
    turno = 1;
    desactivarBtn();
    pokemons[pokemonSelect[jugador]].vidas = 3;
    pokemons[pokemonSelect[pc]].vidas = 3;
    pokemonSelect[jugador] = 0;
    pokemonSelect[pc] = 0;
    btn_seleccionar.disabled = false;
    switchDisplay()
    p_pok_player.removeChild(p_pok_player.lastChild);
    p_pok_pc.removeChild(p_pok_pc.lastChild);
}

function random(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1) + min);
    return num;
}

function actualizarHistorial(turno, ataqueJugador, ataquePC) {
    const aux1 = document.createElement("p");
    aux1.innerHTML = turno + ". " + ataqueJugador;
    document.getElementById("ataquePlayer").appendChild(aux1);

    const aux2 = document.createElement("p");
    aux2.innerHTML = turno + ". " + ataquePC;
    document.getElementById("ataquePC").appendChild(aux2);
}

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
                document.getElementById(pokemons[pokemonSelect[jugador]].tipos[0]).disabled = false;
                document.getElementById(pokemons[pokemonSelect[jugador]].tipos[1]).disabled = false;
            } else {
                document.getElementById(pokemons[pokemonSelect[jugador]].tipos[0]).disabled = false;
            }
            alert("Elegiste a " + pokemons[pokemonSelect[jugador]].nombre);
            //PC
            pokemonSelect[pc] = random(0, pokemons.length-1);
            iconPC.src = pokemons[pokemonSelect[pc]].icono;
            p_pok_pc.appendChild(iconPC);
            alert("La PC eligió a " + pokemons[pokemonSelect[pc]].nombre);

            btn_seleccionar.disabled = true;
            restarVida();
            limpiarHistorial();
            switchDisplay();
        } else {
            aux++;
        }
    });
    if (aux == seleccionables.length) alert("¡Selecciona algún pokémon!");
}

function pelear(btn) {
    let ataquePC = (pokemons[pokemonSelect[pc]].hasSecondType == true ? pokemons[pokemonSelect[pc]].tipos[random(0, 1)] : pokemons[pokemonSelect[pc]].tipos[0]);
    let ataqueJugador = btn.target.id;
    if ((ataqueJugador == "🔥" && ataquePC == "🌱") || (ataqueJugador == "💧" && ataquePC == "🔥") || (ataqueJugador == "🌱" && ataquePC == "💧")) {
        actualizarHistorial(turno++, ataqueJugador, ataquePC, "¡GANASTE!");
        restarVida(pc);
    } else if (ataqueJugador == ataquePC) {
        actualizarHistorial(turno++, ataqueJugador, ataquePC, "¡EMPATE!");
        alert("¡Aleatoriamente, uno de los dos jugadores perderá un punto para resolver el empate!");
        restarVida(random(0, 1));
    } else {
        actualizarHistorial(turno++, ataqueJugador, ataquePC, "¡PERDISTE!");
        restarVida(jugador);
    }
    if (pokemons[pokemonSelect[pc]].vidas == 0 || pokemons[pokemonSelect[jugador]].vidas == 0) {
        alert((pokemons[pokemonSelect[pc]].vidas == 0 ? "¡GANASTE" : "¡PERDISTE") + " EL JUEGO!");
        reiniciar()
    }
}

crearFichasPokemon();
switchDisplay();
desactivarBtn();
btn_seleccionar.addEventListener("click", seleccionarPokemons);
document.getElementsByName("btn").forEach(function (btn) {
    btn.addEventListener("click", pelear);
});