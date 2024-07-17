importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyA_-ghx3R12Q9XMXFifUQ1Ttj8UJEdbpxg",
  authDomain: "gestor-3fe87.firebaseapp.com",
  projectId: "gestor-3fe87",
  storageBucket: "gestor-3fe87.appspot.com",
  messagingSenderId: "826720251855",
  appId: "1:826720251855:web:29ee622d7369ce935facba"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Recebido uma mensagem em segundo plano:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});