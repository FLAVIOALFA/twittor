
// Guardar en el cache dinamico
function updateDynamicCache(DYNAMIC_CACHE, req, res) {

   // Tenemos informacion para actualziar en el cache
   if ( res.ok ) {
      return caches.open(DYNAMIC_CACHE).then(cache => {
         cache.put(req, res.clone());
         return res.clone();
      });
   } else {
      // Si no hay informacion, devolvemos la respuesta tal cual está en este momento
      return res;
   }

}
