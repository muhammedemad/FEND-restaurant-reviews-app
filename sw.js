let cacheVersion = 'version-2';

// cache the application
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheVersion).then(function (cache) {
            return cache.addAll([
                '/',
                'css/',
                'js/',
                'img/',
                'data/'
            ]);
        })
    );
});

// delete old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('version-') &&
                        cacheName != cacheVersion;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// note that this code from stack over flow link here https://stackoverflow.com/questions/40100922/activate-updated-service-worker-on-refresh
// it's the best answer
addEventListener('message', messageEvent => {
    if (messageEvent.data === 'skipWaiting') return skipWaiting();
  });
  
  addEventListener('fetch', event => {
    event.respondWith((async () => {
      if (event.request.mode === "navigate" &&
        event.request.method === "GET" &&
        registration.waiting &&
        (await clients.matchAll()).length < 2
      ) {
        registration.waiting.postMessage('skipWaiting');
        return new Response("", {headers: {"Refresh": "0"}});
      }
      return await caches.match(event.request) ||
        fetch(event.request);
    })());
  });