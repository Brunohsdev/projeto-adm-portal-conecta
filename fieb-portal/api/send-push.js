import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import { createClient } from '@supabase/supabase-js'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "portalconecta-a31df",
      clientEmail: "firebase-adminsdk-fbsvc@portalconecta-a31df.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGz/cqUoOkCFU7\nA3C0JUuqyUsfPXn5Fy1rfw9m0ZeXnkmipfbnQLhejDMqFTLZFEMV5tNCLIZtIbFS\n3WFQIS018fpSCxN+trJSOpDeZRo5O6Hz3sqgWjDmnrtcSg+YDcPPaa4S8TDEWP/M\nHCws2sEhYh/9H8fCY9X0QBJG+3m8CORm/NzyVgOL3eGHR6fdSTbZDk9LxW4r+vO4\nb3ldvBY1eLIgjdPbsvHrZsX870S1yNUzMCDlxjJPfGJ51VEpups33yjBBjE+w8Qk\n48srCeUX+LahHr3MH//FuqCXEhEpkiZUli01DL7yJPp7WfZNOWzpDHu2+EWdacts\nlnRBsnrvAgMBAAECggEALBzp5UCgx+03aBw3zij2VKNMYValMUFUySTMuI4p2jD7\nerTjh2VDY2stURmaCjOmPP5WArlZbG6M52uKk5qA6xbRaZHelf+YqoknKsl5G5jh\nMvjMse7BKfKvdOdT9XOcbnGu97H/lZl/zHy1ypARSUR5/5KlIrs/Nm5e/9P9q1xT\naHjuwRp9yE/uK0LZpNjdOVr7j/ow5op1w0gLKUFiRbKI76OrK2RDP9t5orT2nhNw\ntwxOfFANJQR0d91lQOmENuWMJTkonV42fbsvAUvZtLnBraB7ZjAgrYN7xBPDZnyU\nz9WqldkHF2fTIgOxbB6BIHtWT96SfC8M/GWrbhPlRQKBgQDw8vXeCzUgbd1oWavI\n0ww21HLmYrrmyQPwWCZRFovE5px8ZvSZwxlpvkeoP+F7M/vmwiAiRy+cflbgEueV\nkwB0CYrQPxE3m+mHgmnV0IYHBIeaCAzkpo9zXsahyrUAq5ZF/L0cl8hk9cgIOn5D\nQSrmUo7QIbrL9qvgfvZlwDNumwKBgQDTOzFtlWBWOsOqsDEpWKid65ZHioi/nvkn\n1xYWPJlCXnPfbFsPGqki10tUqYdFpYCDQU8iMlg0EvFR+7fH45x+3PbfVEIjyBJx\nTyZd4eF/nbpksQtsCb+kw8NAZIVsfYbIGlQP6O4tWZu5a0wvsTnkCwkECNpRnRFB\neWnNP9VgPQKBgBnHpQ7Q3CpQFvRnQ74E9rWXHYQQ5DZ1I3q/s7nRU7sJgYy950Xc\nXge2WCxkSVfJRBZ4hr+kJi/0RI9M9oJGbDH+I2AMn2b3w5DAH1rFKNHvZiLQ4bBF\nMewCI/aDncIombd7RzCb/NDwiyp2N7QycMib5LPYKAhSqCko7GwOmHIpAoGAPZzK\nchhcHUrOv/7cmB7QMCADmaKC+MG6EzDdtGbAnWdHjSfh96njI9KAmpVIa7w2nBJ0\nrpjYuXe9BBjUJm3xu99f8wx0rlMxbfOUUVYNnFe5gp1Ro5XEXJ7tWN75PAfxRHTJ\niEp9DqVQkukFM/QR2r6NRqv+YkfaPKrZfZDdAFECgYBgIpdU89thbtS7hn/RH/9k\nPtFuxO6EpEZCZXLfRvtPHyY66PvP89sogomrJ8W581R70W2o5z77BmAaqJfTfyBN\ncomYUCX9UuEx7YNXAD98n2/YRG2tqrtUT+ZELfpIa0qgpnbnM7u9VZv1irOiiRtK\ne90vsOwAdftwiNPmASPWjQ==\n-----END PRIVATE KEY-----\n"
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

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('aluno_email', email)

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
            console.error('Erro token:', err.message)
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