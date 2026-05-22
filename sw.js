const CACHE_NAME = 'tpv-errors-cache-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './tpv_splash.png',
    './icon-192.png',
    './icon-512.png',
    './error_codes_database.csv',
    './qrious.min.js',
    './jsbarcode.min.js'
];


// Instalar y almacenar en caché el App Shell
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Limpiar cachés antiguas en la activación
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia: Network-First falling back to Cache
// Intenta siempre obtener la versión más reciente en red (ej. por si el CSV de códigos cambia).
// Si no hay red, carga inmediatamente desde la caché local.
self.addEventListener('fetch', (e) => {
    // Solo manejar peticiones GET locales o del shell
    if (e.request.method !== 'GET') return;
    
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                // Guardar una copia de la respuesta exitosa en la caché
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // En caso de fallo de red, buscar en la caché
                return caches.match(e.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Si no está en caché y es la navegación principal, retornar index.html
                    if (e.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
