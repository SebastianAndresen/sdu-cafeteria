let sharedVersionNum = 224;
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


/*
importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js");

if (workbox) {
    console.log("Yay! Workbox is loaded !");
    workbox.precaching.precacheAndRoute([]);

    /!*  cache images in the e.g others folder; edit to other folders you got
    and config in the sw-config.js file
    *!/
    workbox.routing.registerRoute(
        /(.*)others(.*)\.(?:png|gif|jpg)/,
        new workbox.strategies.CacheFirst({
            cacheName: "images",
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                })
            ]
        })
    );
    /!* Make your JS and CSS âš¡ fast by returning the assets from the cache,
     while making sure they are updated in the background for the next use.
    *!/
    workbox.routing.registerRoute(
        // cache js, css, scc files
        /.*\.(?:css|js|scss|)/,
        // use cache but update in the background ASAP
        new workbox.strategies.StaleWhileRevalidate({
            // use a custom cache name
            cacheName: "assets",
        })
    );

    // cache google fonts
    workbox.routing.registerRoute(
        new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
        new workbox.strategies.CacheFirst({
            cacheName: "google-fonts",
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        })
    );

    // add offline analytics
    workbox.googleAnalytics.initialize();

    /!* Install a new service worker and have it update
   and control a web page as soon as possible
    *!/

    workbox.core.skipWaiting();
    workbox.core.clientsClaim();

} else {
    console.log("Oops! Workbox didn't load ðŸ‘º");
}*/
