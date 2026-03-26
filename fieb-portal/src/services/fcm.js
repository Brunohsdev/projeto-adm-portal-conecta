import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyBlS5n9YbQBGKibHc2kyeJCDluZFqgeUKI",
  authDomain: "portal-conecta-890fb.firebaseapp.com",
  projectId: "portal-conecta-890fb",
  storageBucket: "portal-conecta-890fb.firebasestorage.app",
  messagingSenderId: "9058505397",
  appId: "1:9058505397:web:2c110fdea573a15fb8a4fc"
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

export async function registrarFCM() {
  if (!('Notification' in window)) throw new Error('Notificações não suportadas')

  const permissao = await Notification.requestPermission()
  if (permissao !== 'granted') throw new Error('Permissão negada')

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js')
  })

  if (!token) throw new Error('Token FCM não gerado')
  return token
}

export async function salvarTokenFCM(supabase, token, email) {
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { endpoint: token, p256dh: 'fcm', auth: 'fcm', aluno_email: email },
      { onConflict: 'endpoint' }
    )
  if (error) throw error
}

export async function dispararPushFCM(email) {
  await fetch('/api/send-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      notificacoes: [
        { title: '✓ Conectado ao WiFi FiEB', body: 'Conexão realizada com sucesso!', url: '/', delay: 0 },
        { title: '🎉 Desafio Liga Jovem', body: 'A Olimpíada de empreendedorismo do SEBRAE.', url: 'https://desafioligajovem.com.br/', delay: 3000 },
        { title: '🚀 Mundo SENAI', body: 'Descubra as tendências em tecnologia.', url: 'https://mundosenai.senaibahia.com.br/', delay: 6000 }
      ]
    })
  })
}

// Notificação em foreground (site aberto)
export function ouvirMensagens(callback) {
  onMessage(messaging, payload => {
    callback(payload.data)
  })
}
