importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

var firebaseConfig = {
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
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
/*
messaging.getToken({vapidKey: 'BGC_e_OwtXp5_v8nCtzUGbWe_Re3v_gVrXyIc8xFdjbtSw2ykrmwIr6djPKXcpiBAfXaqFL9Ykz7Zvug9WKWpDs'}).then((currentToken) => {
    if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
    } else {
        // Show permission request.
        console.log('No registration token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving registration token. ', err);
    setTokenSentToServer(false);
});
*/
