let cacheVersion = 'version-1';

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
