const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

export async function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) throw new Error('Não suportado')
  const registro = await navigator.serviceWorker.register('/service-worker.js')
  await navigator.serviceWorker.ready
  return registro
}

export async function gerarSubscription(registro) {
  const permissao = await Notification.requestPermission()
  if (permissao !== 'granted') throw new Error('Permissão negada')
  return await registro.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  })
}

export async function salvarSubscription(supabase, subscription, email) {
  const sub = subscription.toJSON()
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
        aluno_email: email
      },
      { onConflict: 'endpoint' }
    )
  if (error) throw error
}

export async function dispararPushWelcome() {
  await fetch('/api/send-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    email,
      notificacoes: [
      { icon: '✓', title: 'Conectado ao WiFi FiEB', body: null, url: null, delay: 500 },
      { icon: '🎉', title: 'Desafio Liga Jovem', body: 'A Olimpíada de empreendorismo do SEBRAE.', url: 'https://desafioligajovem.com.br/', delay: 3500 },
      { icon: '🚀', title: 'Mundo SENAI', body: 'Descubra as tendências em tecnologia.', url: 'https://mundosenai.senaibahia.com.br/', delay: 7000 },
     ]
    })
  })
}
