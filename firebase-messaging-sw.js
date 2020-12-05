importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');
// video for FCM: https://www.youtube.com/watch?v=m_P1Q0vhOHs

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
    // Customize notification here
    const notificationTitle = 'Background Message (From SW)';
    const notificationOptions = {
        body: 'Background Message body. (From SW)'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
