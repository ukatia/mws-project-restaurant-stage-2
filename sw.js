let staticCacheName = 'restaurant-cache';
/* ------------ INSTALL EVENT ------------ */
self.addEventListener('install', function(event) {
  var UrlsToCache = [
    '/',
    '/css/',
    '/js/',
    '/img/',
    '/manifest.json',
    '/index.html',
    '/sw.js'
  ];
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache) {
      return cache.addAll(UrlsToCache);
    })
    .catch(function(data) {
      console.log(data);
    })
  );
});

self.addEventListener('activate', function (event) {
  // Perform install steps
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
               return Promise.all(
                   cacheNames.filter(function(cacheName) {
                       return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
                   }).map(function(cacheName) {
                       return caches.delete(cacheName);
                   })    
               );
           })
       );
   });

/* ------------ FETCH EVENT ------------ */
self.addEventListener('fetch', (event) => {
    // console.log(event.request);
    event.respondWith(
        caches.match(event.request).then(response => {
           if (response) {
               console.log('Found URL ', event.request.url, ' in cache');
               return response;
           }
           console.log('Network request for ', event.request.url);
           return fetch(event.request).then(networkResponse => {
               if (networkResponse.status === 404) {
                   console.log(networkResponse.status);
                   return;
               }
               return caches.open(staticCacheName).then(cache => {
                   cache.put(event.request.url, networkResponse.clone());
                   return networkResponse;
               })
           })
       }).catch(error => {
           console.log('Error: ', error);
           return;
        })
    );
});

self.addEventListener('message', (event) => {
   if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
   }
 });

