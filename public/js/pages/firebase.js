import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging.js';

const firebaseConfig = {
  apiKey: "AIzaSyA_-ghx3R12Q9XMXFifUQ1Ttj8UJEdbpxg",
  authDomain: "gestor-3fe87.firebaseapp.com",
  projectId: "gestor-3fe87",
  storageBucket: "gestor-3fe87.appspot.com",
  messagingSenderId: "826720251855",
  appId: "1:826720251855:web:29ee622d7369ce935facba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const messaging = getMessaging(app);

const loginButton = document.getElementById('login-google');
if (loginButton) {
  loginButton.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        user.getIdToken().then((token) => {
          fetch('/Login/authGoogle', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
          }).then(response => {
            if (response.ok) {
              window.location.href = '/';
            } else {
              console.error('Erro ao enviar o token para o backend', response);
            }
          });
        });
      })
      .catch((error) => {
        console.error('Erro ao autenticar com Google:', error);
      });
  });
}


Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    //console.log('Notification permission granted.');
  } else {
    //console.error('Unable to get permission to notify.');
  }
});

navigator.serviceWorker.register('/public/js/pages/firebase-messaging-sw.js')
  .then((registration) => {
    return getToken(messaging, {
      vapidKey: 'BGzyNNV4B-3EypCffvD0T0jwpEhWLVuR678e0pKvYUWpQWt4uePAUbjLsWMFtXLgKGlBkGJs-EQWmJisQbi_TRw',
      serviceWorkerRegistration: registration
    });
  })
  .then((currentToken) => {
    if (currentToken) {
      fetch('/save-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken })
      }).then(response => {
        if (response.ok) {
          //console.log('Token FCM salvo com sucesso no backend');
        } else {
          //console.error('Erro ao salvar o token FCM no backend');
        }
      });
    } else {
      console.warn('Nenhum token FCM disponível. Solicite permissão para gerar um.');
    }
  })
  .catch((err) => {
    console.error('Erro ao obter token FCM:', err);
  });

export { messaging, onMessage };