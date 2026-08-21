/* Workout Gen — service worker
   Stratégie : cache d'abord, réseau en arrière-plan.
   L'app se lance instantanément et fonctionne sans connexion ; une nouvelle
   version est récupérée en tâche de fond et servie au lancement suivant.

   IMPORTANT : à chaque nouvelle version, incrémenter CACHE_VERSION.
   C'est ce qui déclenche la purge de l'ancien cache sur les appareils. */

const CACHE_VERSION = "workoutgen-v2.1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Installation : on met l'app en cache immédiatement.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activation : on supprime les caches des versions précédentes.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Requêtes : on sert le cache, et on rafraîchit en arrière-plan si le réseau
// répond. Hors ligne, l'échec réseau est sans conséquence.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
