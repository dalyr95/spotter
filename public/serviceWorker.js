var CURRENT_CACHES = 'v1.1.1';

self.addEventListener('install', function(event) {
  console.log("SW installed", CURRENT_CACHES, self.registration.scope);
  var cachedAssests = [
    '/',
    'index.html',
    'bundle/css/bundle.css',
    'bundle/js/bundle.js',
    'images/header-logo.png',
    'images/splash.jpg',
    'images/loader.png',
    'images/light-blue-bg.jpg',
    'images/add.png',
    'images/view-clients.png',
    'fonts/montserrat-light-webfont.woff2',
    '/fonts/montserrat-regular-webfont.woff2',
    'fonts/AvenirNext-Bold.woff2',
    'https://cdn.auth0.com/js/lock/10.0/lock.min.js'
  ];

  // Node removes trailing slashes, Apache addes them!
  //var spotterDir = (self.registration.scope.search('localhost') > - 1) ? '/spotter' : '/spotter/';
  //cachedAssests.push(spotterDir);

  event.waitUntil(
    caches.open(CURRENT_CACHES).then(function(cache) {
      return cache.addAll(cachedAssests);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (CURRENT_CACHES.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    ).then(function(response) {
      // Cache the version controlled bundle
      if (event.request.url.search('bundle/js/bundle.js') > -1) {
        caches.open(CURRENT_CACHES).then(function(cache) {
          cache.put(event.request, response);
        });
      }
      return response.clone();
    })
  );
});