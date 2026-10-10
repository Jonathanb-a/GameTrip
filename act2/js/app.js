
/* ===== CONSTANTES CONFIGURABLES ===== */

// Tarifa de cada plan en pesos MXN por día y por persona
const TARIFAS_PLAN = {
    basico: 80,
    aventurero: 140,
    legendario: 220
};

// Factor que multiplica el precio según el destino
const FACTORES_DESTINO = {
    tokio: 1.3,
    "los-angeles": 1.2,
    venecia: 1.25,
    florencia: 1.25,
    cdmx: 1.0
};

// Nombres de los planes para mostrarlos en pantalla
const NOMBRES_PLAN = {
    basico: "Básico",
    aventurero: "Aventurero",
    legendario: "Legendario"
};

// Límites de validación del cotizador y del formulario de contacto
const DIAS_MIN = 1;
const DIAS_MAX = 90;
const PERSONAS_MIN = 1;
const PERSONAS_MAX = 10;
const MENSAJE_MIN_CARACTERES = 10;

// Carrusel: fracción del ancho visible que avanza cada flecha y
// distancia en pixeles a partir de la cual un gesto cuenta como arrastre y no como clic
const CARRUSEL_FRACCION_AVANCE = 0.8;
const CARRUSEL_UMBRAL_ARRASTRE = 8;

// Carrusel en bucle: hacia dónde se mueven solas las fotos ("derecha" o "izquierda"),
// velocidad en pixeles por segundo, milisegundos de espera tras un scroll manual antes de retomar
// el movimiento y cuántas copias de las cards se agregan a cada lado para que nunca se vea el final
const CARRUSEL_DIRECCION_FOTOS = "derecha";
const CARRUSEL_VELOCIDAD = 40;
const CARRUSEL_ESPERA_TRAS_USO = 2000;
const CARRUSEL_COPIAS_POR_LADO = 2;

// Información de cada destino para el modal "Ver más".
// Las claves coinciden con data-destino de las cards y con los value del select del cotizador.
const destinos = {
    tokio: {
        ciudad: "Tokio",
        pais: "Japón",
        juego: "Persona / Yakuza",
        imagen: "img/destino-tokio.jpg",
        imagenAlt: "Calle de Tokio de noche llena de letreros de neón",
        lugarReal: "Barrios de Shibuya y Shinjuku, en el centro de Tokio.",
        queVer: "El cruce de Shibuya, Kabukicho en Shinjuku (el Kamurocho real), Akihabara y el barrio de Sangenjaya que inspiró a Yongen-Jaya.",
        mejorEpoca: "Marzo a mayo por los cerezos, u octubre y noviembre por el clima fresco.",
        costoAproximado: 45000,
        datoCurioso: "La estación de Shibuya que recorres en Persona 5 está recreada con tanto detalle que muchos fans se orientan en la real gracias al juego."
    },
    "los-angeles": {
        ciudad: "Los Ángeles",
        pais: "Estados Unidos",
        juego: "Grand Theft Auto",
        imagen: "img/destino-los-angeles.jpg",
        imagenAlt: "Avenida de Los Ángeles con palmeras y el letrero de Hollywood al fondo",
        lugarReal: "Santa Mónica, Venice, Hollywood y el centro de Los Ángeles, California.",
        queVer: "El muelle de Santa Mónica, Venice Beach, el Observatorio Griffith, el letrero de Hollywood y el centro de la ciudad.",
        mejorEpoca: "Abril a junio o septiembre a noviembre, con buen clima y menos turistas.",
        costoAproximado: 32000,
        datoCurioso: "Los Santos es una versión comprimida de Los Ángeles: el letrero de Vinewood, el muelle Del Perro y Vespucci Beach tienen su gemelo real."
    },
    venecia: {
        ciudad: "Venecia",
        pais: "Italia",
        juego: "Assassin's Creed",
        imagen: "img/destino-venecia.jpg",
        imagenAlt: "Canal de Venecia con góndolas y edificios históricos",
        lugarReal: "Centro histórico de Venecia, sobre la laguna véneta.",
        queVer: "La Plaza y la Basílica de San Marcos, el Puente de Rialto, el Palacio Ducal y un recorrido en góndola por el Gran Canal.",
        mejorEpoca: "Abril a junio o septiembre y octubre; en febrero se celebra el Carnaval.",
        costoAproximado: 40000,
        datoCurioso: "El Carnaval de Venecia, con sus máscaras, es escenario de varias misiones de Ezio en Assassin's Creed II."
    },
    florencia: {
        ciudad: "Florencia",
        pais: "Italia",
        juego: "Assassin's Creed",
        imagen: "img/destino-florencia.jpg",
        imagenAlt: "Vista panorámica de Florencia con la cúpula de Santa María del Fiore",
        lugarReal: "Centro histórico de Florencia, en la región de Toscana.",
        queVer: "La catedral de Santa María del Fiore y su cúpula, el Ponte Vecchio, el Palazzo Vecchio y la Galería Uffizi.",
        mejorEpoca: "Abril a junio o septiembre y octubre, para evitar el calor fuerte del verano.",
        costoAproximado: 38000,
        datoCurioso: "A la cúpula de Brunelleschi se sube por 463 escalones; en el juego Ezio la escala por fuera en un par de minutos."
    },
    cdmx: {
        ciudad: "CDMX",
        pais: "México",
        juego: "Forza Horizon 5",
        imagen: "img/destino-cdmx.jpg",
        imagenAlt: "Paseo de la Reforma en la Ciudad de México con el Ángel de la Independencia",
        lugarReal: "Ciudad de México, punto de partida hacia los paisajes del juego.",
        queVer: "El Zócalo, el Palacio de Bellas Artes, el Castillo de Chapultepec, Coyoacán y las pirámides de Teotihuacán a una hora de la ciudad.",
        mejorEpoca: "Marzo a mayo, o finales de octubre para vivir el Día de Muertos.",
        costoAproximado: 12000,
        datoCurioso: "El mapa de Forza Horizon 5 no incluye la capital: sus lugares reales, como Guanajuato y Teotihuacán, se visitan fácilmente saliendo desde CDMX."
    }
};

/* ===== FUNCIONES DE APOYO ===== */

// Convierte un número a texto con formato de pesos mexicanos
function formatoPesos(cantidad) {
    return cantidad.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

// Crea un elemento HTML con texto y, si se indica, un icono de Font Awesome al inicio
function crearElemento(etiqueta, texto, claseIcono) {
    const elemento = document.createElement(etiqueta);
    if (claseIcono) {
        const icono = document.createElement("i");
        icono.className = claseIcono;
        icono.setAttribute("aria-hidden", "true");
        elemento.append(icono, " ");
    }
    elemento.append(texto);
    return elemento;
}

// Crea un renglón de lista con una etiqueta en negritas seguida de su valor
function crearRenglon(etiqueta, valor, claseIcono) {
    const renglon = crearElemento("li", "", claseIcono);
    const negritas = document.createElement("strong");
    negritas.textContent = etiqueta + ": ";
    renglon.append(negritas, valor);
    return renglon;
}

// Muestra una lista de errores dentro del contenedor indicado
function mostrarErrores(contenedor, errores) {
    const titulo = crearElemento("p", "Revisa lo siguiente:", "fa-solid fa-triangle-exclamation");
    const lista = document.createElement("ul");
    errores.forEach(function (error) {
        lista.append(crearElemento("li", error, "fa-solid fa-xmark"));
    });
    contenedor.replaceChildren(titulo, lista);
}

/* ===== INICIO ===== */

document.addEventListener("DOMContentLoaded", function () {

    /* ----- 1. MENÚ MÓVIL ----- */

    const btnMenu = document.getElementById("btn-menu");
    const nav = document.getElementById("nav-principal");
    const iconoMenu = btnMenu.querySelector("i");

    // Abre o cierra el menú móvil y actualiza el icono y los atributos de accesibilidad
    function alternarMenu(abrir) {
        const abierto = nav.classList.toggle("abierto", abrir);
        btnMenu.setAttribute("aria-expanded", String(abierto));
        btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación");
        iconoMenu.className = abierto ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }

    btnMenu.addEventListener("click", function () {
        alternarMenu();
    });

    nav.querySelectorAll(".nav-enlace").forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            alternarMenu(false);
        });
    });

    /* ----- 2. CARRUSEL DE DESTINOS ----- */

    const carrusel = document.querySelector(".carrusel");
    const pista = document.querySelector(".carrusel-pista");
    const btnAnterior = document.getElementById("car-prev");
    const btnSiguiente = document.getElementById("car-next");

    // --- Bucle sin fin: se clonan las cards antes y después de las originales ---

    const cardsOriginales = Array.from(pista.querySelectorAll(".card-destino"));
    let anchoJuego = 0;

    // Devuelve una copia de las cards originales, fuera del orden de tabulación y oculta a lectores de pantalla
    function clonarJuegoDeCards() {
        const fragmento = document.createDocumentFragment();
        cardsOriginales.forEach(function (card) {
            const clon = card.cloneNode(true);
            clon.setAttribute("tabindex", "-1");
            clon.setAttribute("aria-hidden", "true");
            fragmento.append(clon);
        });
        return fragmento;
    }

    for (let i = 0; i < CARRUSEL_COPIAS_POR_LADO; i++) {
        pista.prepend(clonarJuegoDeCards());
        pista.append(clonarJuegoDeCards());
    }
    pista.classList.add("bucle");

    // Mide cuánto ocupa un juego completo de cards (cambia con el tamaño de pantalla)
    function medirJuego() {
        const ultimaOriginal = cardsOriginales[cardsOriginales.length - 1];
        anchoJuego = ultimaOriginal.nextElementSibling.offsetLeft - cardsOriginales[0].offsetLeft;
    }

    // Lleva una posición de scroll al tramo de las cards originales; como las copias son idénticas, el salto no se nota
    function posicionEnBucle(x) {
        const inicio = anchoJuego * CARRUSEL_COPIAS_POR_LADO;
        if (anchoJuego <= 0) {
            return x;
        }
        while (x < inicio) {
            x += anchoJuego;
        }
        while (x >= inicio + anchoJuego) {
            x -= anchoJuego;
        }
        return x;
    }

    // Recoloca la pista dentro del tramo original si un scroll manual la sacó de ahí
    function normalizarPista() {
        const corregida = posicionEnBucle(pista.scrollLeft);
        if (Math.abs(corregida - pista.scrollLeft) > 1) {
            pista.scrollLeft = corregida;
        }
    }

    medirJuego();
    pista.scrollLeft = anchoJuego * CARRUSEL_COPIAS_POR_LADO;

    // --- Movimiento automático ---

    // Motivos por los que el movimiento está en pausa; solo avanza cuando no hay ninguno
    const pausas = new Set();
    const sentidoScroll = CARRUSEL_DIRECCION_FOTOS === "derecha" ? -1 : 1;
    let posicion = pista.scrollLeft;
    let tiempoAnterior = 0;
    let temporizadorManual = null;
    let temporizadorNormalizar = null;
    let tocando = false;

    // Detiene el movimiento automático por el motivo indicado
    function pausarCarrusel(motivo) {
        pausas.add(motivo);
    }

    // Quita un motivo de pausa y, si ya no queda ninguno, retoma el movimiento desde donde está la pista
    function reanudarCarrusel(motivo) {
        pausas.delete(motivo);
        if (pausas.size === 0) {
            normalizarPista();
            posicion = pista.scrollLeft;
        }
    }

    // Pausa el movimiento mientras el usuario desplaza la pista y lo retoma un momento después
    function pausarPorUsoManual() {
        pausarCarrusel("manual");
        clearTimeout(temporizadorManual);
        temporizadorManual = setTimeout(function () {
            if (tocando) {
                pausarPorUsoManual();
                return;
            }
            reanudarCarrusel("manual");
        }, CARRUSEL_ESPERA_TRAS_USO);
    }

    // Avanza la pista unos pixeles en cada cuadro de animación y da la vuelta al llegar al final del juego
    function animarCarrusel(tiempo) {
        const transcurrido = Math.min(tiempo - tiempoAnterior, 50);
        tiempoAnterior = tiempo;
        if (pausas.size === 0) {
            posicion = posicionEnBucle(posicion + sentidoScroll * CARRUSEL_VELOCIDAD * transcurrido / 1000);
            pista.scrollLeft = posicion;
        }
        requestAnimationFrame(animarCarrusel);
    }

    // Si el usuario pidió menos animaciones en su sistema, el carrusel no se mueve solo
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        pausarCarrusel("movimiento-reducido");
    }

    // El movimiento se detiene con el mouse encima, para poder leer y hacer clic con calma
    carrusel.addEventListener("mouseenter", function () {
        pausarCarrusel("mouse");
    });

    carrusel.addEventListener("mouseleave", function () {
        reanudarCarrusel("mouse");
    });

    // También se detiene mientras se navega el carrusel con el teclado
    carrusel.addEventListener("focusin", function (evento) {
        if (evento.target.matches(":focus-visible")) {
            pausarCarrusel("teclado");
        }
    });

    carrusel.addEventListener("focusout", function (evento) {
        if (!carrusel.contains(evento.relatedTarget)) {
            reanudarCarrusel("teclado");
        }
    });

    // Deslizar con el dedo o con la rueda pausa el movimiento por un momento
    pista.addEventListener("touchstart", function () {
        tocando = true;
        pausarPorUsoManual();
    }, { passive: true });

    ["touchend", "touchcancel"].forEach(function (tipo) {
        pista.addEventListener(tipo, function () {
            tocando = false;
        }, { passive: true });
    });

    pista.addEventListener("wheel", pausarPorUsoManual, { passive: true });

    requestAnimationFrame(animarCarrusel);

    // --- Flechas ---

    // Desplaza la pista un 80% de su ancho visible; sentido -1 retrocede y 1 avanza
    function moverCarrusel(sentido) {
        pausarPorUsoManual();
        pista.scrollBy({
            left: sentido * pista.clientWidth * CARRUSEL_FRACCION_AVANCE,
            behavior: "smooth"
        });
    }

    // Oculta una flecha si la pista llega a un extremo (con el bucle sin fin casi nunca ocurre)
    function actualizarFlechas() {
        const maximo = pista.scrollWidth - pista.clientWidth;
        btnAnterior.classList.toggle("oculto", pista.scrollLeft <= 1);
        btnSiguiente.classList.toggle("oculto", pista.scrollLeft >= maximo - 1);
    }

    btnAnterior.addEventListener("click", function () {
        moverCarrusel(-1);
    });

    btnSiguiente.addEventListener("click", function () {
        moverCarrusel(1);
    });

    // En cada scroll se actualizan las flechas; si el scroll es manual, se alarga la pausa
    // y al terminar se recoloca la pista para que el bucle nunca se quede sin cards
    pista.addEventListener("scroll", function () {
        actualizarFlechas();
        if (pausas.size === 0) {
            return;
        }
        if (pausas.has("manual")) {
            pausarPorUsoManual();
        }
        clearTimeout(temporizadorNormalizar);
        temporizadorNormalizar = setTimeout(function () {
            if (!tocando) {
                normalizarPista();
            }
        }, 200);
    }, { passive: true });

    // Al cambiar el tamaño de la ventana cambian las medidas de las cards
    window.addEventListener("resize", function () {
        medirJuego();
        normalizarPista();
        posicion = pista.scrollLeft;
        actualizarFlechas();
    });

    actualizarFlechas();

    // --- Clic contra arrastre ---

    // Datos del último gesto sobre la pista, para distinguir un clic de un arrastre o scroll
    let gestoX = 0;
    let gestoY = 0;
    let gestoScroll = 0;
    let huboArrastre = false;

    // Al presionar sobre la pista se guarda la posición inicial del puntero y del scroll
    pista.addEventListener("pointerdown", function (evento) {
        gestoX = evento.clientX;
        gestoY = evento.clientY;
        gestoScroll = pista.scrollLeft;
        huboArrastre = false;
        pausarPorUsoManual();
    });

    // Si el puntero se aleja más del umbral mientras está presionado, el gesto es un arrastre
    pista.addEventListener("pointermove", function (evento) {
        if (evento.buttons === 0 && evento.pointerType === "mouse") {
            return;
        }
        const distancia = Math.hypot(evento.clientX - gestoX, evento.clientY - gestoY);
        if (distancia > CARRUSEL_UMBRAL_ARRASTRE) {
            huboArrastre = true;
        }
    });

    // Indica si el clic recién recibido viene de un arrastre o de un scroll de la pista
    function fueArrastre() {
        const seMovioLaPista = Math.abs(pista.scrollLeft - gestoScroll) > CARRUSEL_UMBRAL_ARRASTRE;
        return huboArrastre || seMovioLaPista;
    }

    /* ----- 3. MODAL DE DESTINO ----- */

    const modal = document.getElementById("modal");
    const modalCuerpo = document.getElementById("modal-cuerpo");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    let cardQueAbrioModal = null;

    // Llena el modal con toda la información del destino elegido y lo muestra
    function abrirModal(claveDestino) {
        const destino = destinos[claveDestino];
        if (!destino) {
            return;
        }

        const titulo = crearElemento("h3", destino.ciudad, "fa-solid fa-location-dot");
        const juego = crearElemento("p", destino.juego, "fa-solid fa-gamepad");

        const imagen = document.createElement("img");
        imagen.src = destino.imagen;
        imagen.alt = destino.imagenAlt;

        const lista = document.createElement("ul");
        lista.append(
            crearRenglon("Lugar real", destino.lugarReal + " (" + destino.pais + ")", "fa-solid fa-map-location-dot"),
            crearRenglon("Qué ver", destino.queVer, "fa-solid fa-binoculars"),
            crearRenglon("Mejor época", destino.mejorEpoca, "fa-solid fa-calendar-days"),
            crearRenglon("Costo aproximado del viaje", formatoPesos(destino.costoAproximado) + " por persona", "fa-solid fa-money-bill-wave"),
            crearRenglon("Dato curioso", destino.datoCurioso, "fa-solid fa-lightbulb")
        );

        const btnConsultar = crearElemento("button", "Consultar este destino", "fa-solid fa-paper-plane");
        btnConsultar.type = "button";
        btnConsultar.className = "btn btn-primario btn-consultar";
        btnConsultar.addEventListener("click", function () {
            consultarDestino(claveDestino);
        });

        modalCuerpo.replaceChildren(titulo, juego, imagen, lista, btnConsultar);
        modal.classList.add("visible");
        modal.setAttribute("aria-hidden", "false");
        pausarCarrusel("modal");
        btnCerrarModal.focus();
    }

    // Oculta el modal y borra su contenido; si se indica, regresa el foco a la card que lo abrió
    function cerrarModal(regresarFoco) {
        modal.classList.remove("visible");
        modal.setAttribute("aria-hidden", "true");
        reanudarCarrusel("modal");
        modalCuerpo.replaceChildren();
        if (regresarFoco && cardQueAbrioModal) {
            cardQueAbrioModal.focus();
        }
        cardQueAbrioModal = null;
    }

    // Cierra el modal, elige el destino en el cotizador, baja hasta él y enfoca el campo de días
    function consultarDestino(claveDestino) {
        cerrarModal(false);
        selectDestino.value = claveDestino;
        seccionCotizador.scrollIntoView({ behavior: "smooth" });
        inputDias.focus({ preventScroll: true });
    }

    // Abre el modal de una card (original o copia) y la recuerda para regresarle el foco al cerrar
    function abrirDesdeCard(card) {
        cardQueAbrioModal = card;
        abrirModal(card.dataset.destino);
    }

    // Clic en cualquier card de la pista: abre el modal, salvo que el gesto haya sido un arrastre o scroll
    pista.addEventListener("click", function (evento) {
        const card = evento.target.closest(".card-destino");
        if (!card || fueArrastre()) {
            return;
        }
        abrirDesdeCard(card);
    });

    // Enter o Espacio con el foco en una card también abren el modal
    pista.addEventListener("keydown", function (evento) {
        const card = evento.target.closest(".card-destino");
        if (card && (evento.key === "Enter" || evento.key === " ")) {
            evento.preventDefault();
            abrirDesdeCard(card);
        }
    });

    btnCerrarModal.addEventListener("click", function () {
        cerrarModal(true);
    });

    // Cierra el modal al hacer clic en el fondo oscuro, fuera del contenido
    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) {
            cerrarModal(true);
        }
    });

    // Cierra el modal con la tecla Escape
    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && modal.classList.contains("visible")) {
            cerrarModal(true);
        }
    });

    /* ----- 4. COTIZADOR ----- */

    const seccionCotizador = document.getElementById("cotizador");
    const formCotizador = document.getElementById("form-cotizador");
    const selectDestino = document.getElementById("cotizador-destino");
    const inputDias = document.getElementById("cotizador-dias");
    const inputPersonas = document.getElementById("cotizador-personas");
    const selectPlan = document.getElementById("cotizador-plan");
    const resultado = document.getElementById("resultado");

    // Se desactiva la validación nativa del navegador para mostrar nuestros propios mensajes
    formCotizador.noValidate = true;

    // Revisa los datos del cotizador y devuelve una lista con los errores encontrados
    function validarCotizador(destino, dias, personas, plan) {
        const errores = [];
        if (!(destino in FACTORES_DESTINO)) {
            errores.push("Selecciona un destino.");
        }
        if (!Number.isInteger(dias) || dias < DIAS_MIN || dias > DIAS_MAX) {
            errores.push("Los días deben ser un número entero entre " + DIAS_MIN + " y " + DIAS_MAX + ".");
        }
        if (!Number.isInteger(personas) || personas < PERSONAS_MIN || personas > PERSONAS_MAX) {
            errores.push("Las personas deben ser un número entero entre " + PERSONAS_MIN + " y " + PERSONAS_MAX + ".");
        }
        if (!(plan in TARIFAS_PLAN)) {
            errores.push("Selecciona un plan.");
        }
        return errores;
    }

    // Calcula el total: tarifa del plan x días x personas x factor del destino
    function calcularTotal(destino, dias, personas, plan) {
        return TARIFAS_PLAN[plan] * dias * personas * FACTORES_DESTINO[destino];
    }

    // Muestra en #resultado el desglose de la cotización
    function mostrarCotizacion(destino, dias, personas, plan, total) {
        const titulo = crearElemento("h3", "Tu cotización estimada", "fa-solid fa-receipt");
        const lista = document.createElement("ul");
        lista.append(
            crearRenglon("Destino", destinos[destino].ciudad + ", " + destinos[destino].pais, "fa-solid fa-location-dot"),
            crearRenglon("Plan", NOMBRES_PLAN[plan] + " (" + formatoPesos(TARIFAS_PLAN[plan]) + " por día por persona)", "fa-solid fa-shield-halved"),
            crearRenglon("Días", String(dias), "fa-solid fa-calendar-days"),
            crearRenglon("Personas", String(personas), "fa-solid fa-users"),
            crearRenglon("Factor del destino", "x" + FACTORES_DESTINO[destino], "fa-solid fa-earth-americas"),
            crearRenglon("Total estimado", formatoPesos(total) + " MXN", "fa-solid fa-coins")
        );
        resultado.replaceChildren(titulo, lista);
    }

    // Al enviar el cotizador valida los datos y muestra el total o los errores
    formCotizador.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const destino = selectDestino.value;
        const dias = Number(inputDias.value.trim() === "" ? NaN : inputDias.value);
        const personas = Number(inputPersonas.value.trim() === "" ? NaN : inputPersonas.value);
        const plan = selectPlan.value;

        const errores = validarCotizador(destino, dias, personas, plan);
        if (errores.length > 0) {
            mostrarErrores(resultado, errores);
            return;
        }

        const total = calcularTotal(destino, dias, personas, plan);
        mostrarCotizacion(destino, dias, personas, plan, total);
    });

    /* ----- 5. FORMULARIO DE CONTACTO ----- */

    const formContacto = document.getElementById("form-contacto");
    const inputNombre = document.getElementById("contacto-nombre");
    const inputCorreo = document.getElementById("contacto-correo");
    const inputMensaje = document.getElementById("contacto-mensaje");
    const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    formContacto.noValidate = true;

    // Caja de avisos del contacto: se crea aquí y reutiliza la clase "resultado" del CSS
    const avisoContacto = document.createElement("div");
    avisoContacto.className = "resultado";
    avisoContacto.setAttribute("aria-live", "polite");
    formContacto.after(avisoContacto);

    // Revisa los datos de contacto y devuelve una lista con los errores encontrados
    function validarContacto(nombre, correo, mensaje) {
        const errores = [];
        if (nombre === "") {
            errores.push("Escribe tu nombre.");
        }
        if (!FORMATO_CORREO.test(correo)) {
            errores.push("Escribe un correo válido, por ejemplo jugador@correo.com.");
        }
        if (mensaje.length < MENSAJE_MIN_CARACTERES) {
            errores.push("El mensaje debe tener al menos " + MENSAJE_MIN_CARACTERES + " caracteres.");
        }
        return errores;
    }

    // Al enviar el contacto valida los datos, muestra la confirmación y limpia el formulario (no se envía nada a ningún servidor)
    formContacto.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = inputNombre.value.trim();
        const correo = inputCorreo.value.trim();
        const mensaje = inputMensaje.value.trim();

        const errores = validarContacto(nombre, correo, mensaje);
        if (errores.length > 0) {
            mostrarErrores(avisoContacto, errores);
            return;
        }

        const confirmacion = crearElemento(
            "p",
            "Mensaje recibido, " + nombre + ". Te responderemos pronto a " + correo + ".",
            "fa-solid fa-circle-check"
        );
        avisoContacto.replaceChildren(confirmacion);
        formContacto.reset();
    });
});
