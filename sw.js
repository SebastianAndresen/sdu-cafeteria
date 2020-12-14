let sharedVersionNum = 262;
const dynamicCache = `site-dynamic-v1.3.${sharedVersionNum}`;
const dynamicCache_MAXSIZE = 15;
const staticCache = `site-static-v1.3.${sharedVersionNum}`; //Increment whenever a change is made to one of the following assets
console.log(dynamicCache, staticCache);

const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    '/pages/fallback.html'
];
// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCache).then(cache => {
            console.log('caching assets...');
            cache.addAll(assets);
        }));
    console.log('service worker has been installed.');
});

//listen to activate event
self.addEventListener('activate', evt => {
    //delete old cache versions.
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCache && key !== dynamicCache)
                .map(key => caches.delete(key)))
        })
    );
    console.log('service worker has been activated.');
});

// fetch event
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt.request.url)
    //console.log('fetch event', evt)

    if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        //get assets from pre-cached assets if possible
        evt.respondWith(
            caches.match(evt.request).then(cacheResponse => {
                return cacheResponse || fetch(evt.request).then(fetchResponse => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(evt.request.url, fetchResponse.clone());
                        limitCacheSize(dynamicCache, dynamicCache_MAXSIZE);
                        return fetchResponse;
                    });
                });
            }).catch(() => { //OFFLINE fallback
                // If response to .html file request isn't in cache --> show fallback .html
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
                /*if (evt.request.url.indexOf('.png') > -1) {
                    caches.match('/img/fallback.png'); // IMAGE DOESN'T EXIST
                }*/

            })
        )
    }
});

