importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAFl469L0-MjT-zsmG8y0F8xgsPJpKRDV4",
    authDomain: "stl-e20.firebaseapp.com",
    databaseURL: "https://stl-e20.firebaseio.com",
    projectId: "stl-e20",
    storageBucket: "stl-e20.appspot.com",
    messagingSenderId: "779712017147",
    appId: "1:779712017147:web:1d95a4e8fc851d9375765e",
    measurementId: "G-61P2PH6C0N"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    return self.registration.showNotification(payload.data.title, {
        body: payload.data.body,
        image: payload.data.image,
        icon: payload.data.icon
    });
});
self.addEventListener('notificationclick', function(event) {
    const urlToOpen = new URL('https://sdu-cafeteria.netlify.app/', self.location.origin).href;

    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        let matchingClient = null;

        for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.url === urlToOpen) {
                matchingClient = windowClient;
                break;
            }
        }

        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});