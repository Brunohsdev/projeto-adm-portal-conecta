import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import { createClient } from '@supabase/supabase-js'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  try {
    const { notificacoes, email } = req.body

    console.log('📧 Email recebido:', email)

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('aluno_email', email)

    console.log('📱 Tokens encontrados:', subscriptions?.length)

    if (error) throw error
    if (!subscriptions?.length) return res.status(200).json({ message: 'Nenhum token encontrado' })

    const tokens = subscriptions.map(s => s.endpoint)

    for (const notif of notificacoes) {
      if (notif.delay > 0) await new Promise(r => setTimeout(r, notif.delay))

      await Promise.allSettled(
        tokens.map(token =>
          getMessaging().send({
            token,
            data: { title: notif.title, body: notif.body, url: notif.url || '/' },
            webpush: {
              notification: { title: notif.title, body: notif.body, icon: '/logo.png' },
              fcmOptions: { link: notif.url || '/' }
            }
          }).catch(err => {
            console.error('Erro token:', token, err.message)
            if (err.code === 'messaging/registration-token-not-registered') {
              return supabase.from('push_subscriptions').delete().eq('endpoint', token)
            }
          })
        )
      )
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Erro interno:', err)
    return res.status(500).json({ error: 'Erro interno' })
  }
}