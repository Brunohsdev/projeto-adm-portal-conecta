import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  'mailto:contato@fieb.org.br',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  try {
    const { notificacoes } = req.body
    const { data: subscriptions, error } = await supabase.from('push_subscriptions').select('*')
    if (error) throw error
    if (!subscriptions?.length) return res.status(200).json({ message: 'Nenhuma subscription' })

    for (const notif of notificacoes) {
      if (notif.delay > 0) await new Promise(r => setTimeout(r, notif.delay))
      const payload = JSON.stringify({ title: notif.title, body: notif.body, url: notif.url })
      await Promise.allSettled(
        subscriptions.map(sub =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          ).catch(err => {
            if (err.statusCode === 410) return supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
          })
        )
      )
    }
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro interno' })
  }
}