importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyBlS5n9YbQBGKibHc2kyeJCDluZFqgeUKI",
  authDomain: "portal-conecta-890fb.firebaseapp.com",
  projectId: "portal-conecta-890fb",
  storageBucket: "portal-conecta-890fb.firebasestorage.app",
  messagingSenderId: "9058505397",
  appId: "1:9058505397:web:2c110fdea573a15fb8a4fc"
})

const messaging = firebase.messaging()

// Notificação em background
messaging.onBackgroundMessage(payload => {
  const { title, body, url } = payload.data || {}
  self.registration.showNotification(title || 'FiEB WiFi', {
    body: body || '',
    icon: '/logo.png',
    badge: '/logo.png',
    data: { url: url || '/' }
  })
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})
