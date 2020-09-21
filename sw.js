// Imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
   // '/',
   'index.html',
   'css/style.css',
   'img/favicon.ico',
   'img/avatars/hulk.jpg',
   'img/avatars/ironman.jpg',
   'img/avatars/spiderman.jpg',
   'img/avatars/thor.jpg',
   'img/avatars/wolverine.jpg',
   'js/app.js',
   'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
   'https://fonts.googleapis.com/css?family=Quicksand:300,400',
   'https://fonts.googleapis.com/css?family=Lato:400,300',
   'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
   'css/animate.css',
   'js/libs/jquery.js'
];

self.addEventListener('install', e => {

   // Guardar todo el app shell en el cache
   const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
   const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE))
   const promises = Promise.all([cacheStatic, cacheInmutable]);

   e.waitUntil(promises);

});

self.addEventListener('activate', e => {

   // Con esto limpiamos el cache viejo
   const response = caches.keys().then(keys => {
      keys.forEach( key => {
         if ( key !== STATIC_CACHE && key.includes('static')) {
            return caches.delete(key);
         }

         if ( key !== DYNAMIC_CACHE && key.includes('dynamic')) {
            return caches.delete(key);
         }
      })
   })

   e.waitUntil(response);

});

self.addEventListener('fetch', e => {

   const response = caches.match(e.request).then( resp => {
      if ( resp ) {
         return resp;
      } else {
         return fetch(e.request).then( newResp => {
            return updateDynamicCache(DYNAMIC_CACHE, e.request, newResp);
         })
      }
       
   })
   e.respondWith(response);

})