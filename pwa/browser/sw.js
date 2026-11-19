/* =========================================================
   GameTrip Seguro - Service Worker
   Guarda en Cache Storage los archivos de la app para que
   funcione sin conexión. El mismo archivo se usa en las
   cuatro versiones (browser, minimal-ui, standalone y
   fullscreen); cada una tiene su propio caché.
   ========================================================= */

// Cambia este número cuando modifiques archivos, para que se descargue la versión nueva
const VERSION_CACHE = "v1";

// Nombre de la carpeta de esta versión (browser, minimal-ui, standalone o fullscreen)
const CARPETA = new URL(self.registration.scope).pathname.split("/").filter(Boolean).pop();

// Las cuatro versiones comparten el mismo dominio, así que cada caché lleva el nombre de su carpeta
const PREFIJO_CACHE = "gametrip-" + CARPETA + "-";
const NOMBRE_CACHE = PREFIJO_CACHE + VERSION_CACHE;

// Archivos propios de la app que se guardan al instalar el Service Worker (rutas relativas a este archivo)
const ARCHIVOS_APP = [
    "./",
    "./index.html",
    "./manifest.json",
    "../comun/css/estilos.css",
    "../comun/js/app.js",
    "../comun/iconos/favicon.png",
    "../comun/iconos/icono-192.png",
    "../comun/iconos/icono-512.png",
    "../comun/iconos/icono-maskable-512.png",
    "../comun/iconos/apple-touch-icon.png",
    "../comun/img/logo.png",
    "../comun/img/hero.jpg",
    "../comun/img/destino-tokio.jpg",
    "../comun/img/destino-los-angeles.jpg",
    "../comun/img/destino-venecia.jpg",
    "../comun/img/destino-florencia.jpg",
    "../comun/img/destino-cdmx.jpg",
    "../comun/img/galeria1.jpg",
    "../comun/img/galeria2.jpg",
    "../comun/img/galeria3.jpg",
    "../comun/img/galeria4.jpg",
    "../comun/img/galeria5.jpg",
    "../comun/img/galeria6.jpg"
];

// Hojas de estilo externas (Font Awesome y Google Fonts); también se guardan las fuentes que cargan
const ESTILOS_EXTERNOS = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@500;700;900&display=swap"
];

// Descarga una hoja de estilo externa, la guarda y guarda también los archivos de fuente que menciona
async function guardarEstiloExterno(cache, url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
        return;
    }
    await cache.put(url, respuesta.clone());
    const css = await respuesta.text();
    const fuentes = [...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map(function (coincidencia) {
        return new URL(coincidencia[1].replace(/["']/g, ""), url).href;
    });
    await Promise.all(fuentes.map(function (fuente) {
        return cache.add(fuente).catch(function () {});
    }));
}

// Instalación: guarda todos los archivos de la app; los externos se intentan sin bloquear la instalación
self.addEventListener("install", function (evento) {
    evento.waitUntil((async function () {
        const cache = await caches.open(NOMBRE_CACHE);
        await cache.addAll(ARCHIVOS_APP);
        await Promise.all(ESTILOS_EXTERNOS.map(function (url) {
            return guardarEstiloExterno(cache, url).catch(function () {});
        }));
        await self.skipWaiting();
    })());
});

// Activación: borra los cachés viejos de esta misma versión y toma el control de la página abierta
self.addEventListener("activate", function (evento) {
    evento.waitUntil((async function () {
        const nombres = await caches.keys();
        await Promise.all(nombres
            .filter(function (nombre) {
                return nombre.startsWith(PREFIJO_CACHE) && nombre !== NOMBRE_CACHE;
            })
            .map(function (nombre) {
                return caches.delete(nombre);
            }));
        await self.clients.claim();
    })());
});

// Página (navegación): primero intenta la red para tener la versión más nueva; sin conexión usa el caché
async function responderPagina(peticion) {
    const cache = await caches.open(NOMBRE_CACHE);
    try {
        const respuesta = await fetch(peticion);
        if (respuesta.ok) {
            cache.put(peticion, respuesta.clone());
        }
        return respuesta;
    } catch (error) {
        return (await cache.match(peticion, { ignoreSearch: true })) || cache.match("./index.html");
    }
}

// Archivos propios (CSS, JS, imágenes): primero el caché, y si no están, la red
async function responderArchivo(peticion) {
    const cache = await caches.open(NOMBRE_CACHE);
    const guardada = await cache.match(peticion, { ignoreSearch: true });
    if (guardada) {
        return guardada;
    }
    const respuesta = await fetch(peticion);
    if (respuesta.ok) {
        cache.put(peticion, respuesta.clone());
    }
    return respuesta;
}

// Archivos externos (iconos y fuentes): responde con el caché y lo actualiza en segundo plano
async function responderExterno(peticion) {
    const cache = await caches.open(NOMBRE_CACHE);
    const guardada = await cache.match(peticion);
    const deRed = fetch(peticion).then(function (respuesta) {
        if (respuesta.ok || respuesta.type === "opaque") {
            cache.put(peticion, respuesta.clone());
        }
        return respuesta;
    }).catch(function () {
        return guardada;
    });
    return guardada || deRed;
}

// Intercepta cada petición de la página y decide de dónde responder
self.addEventListener("fetch", function (evento) {
    const peticion = evento.request;
    if (peticion.method !== "GET") {
        return;
    }
    if (peticion.mode === "navigate") {
        evento.respondWith(responderPagina(peticion));
    } else if (new URL(peticion.url).origin === self.location.origin) {
        evento.respondWith(responderArchivo(peticion));
    } else {
        evento.respondWith(responderExterno(peticion));
    }
});
