import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAluno } from '../context/Alunocontext'
import './Conectado.css'

const NOTIFICACOES = [
  { icon: '✓', title: 'Conectado ao WiFi FiEB', body: null, url: null, delay: 500 },
  { icon: '🎉', title: 'Desafio Liga Jovem', body: 'A Olimpíada de empreendorismo do SEBRAE.', url: 'https://desafioligajovem.com.br/', delay: 3500 },
  { icon: '🚀', title: 'Mundo SENAI', body: 'Descubra as tendências em tecnologia.', url: 'https://mundosenai.senaibahia.com.br/', delay: 7000 },
]

export default function Conectado() {
  const navigate = useNavigate()
  const { aluno, limparAluno } = useAluno()
  const overlayRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    if (!aluno) { navigate('/'); return }

    const notifs = [
      { ...NOTIFICACOES[0], body: `Olá ${aluno.nome}! Conexão realizada com sucesso.` },
      ...NOTIFICACOES.slice(1)
    ]

    notifs.forEach(({ icon, title, body, url, delay }) => {
      const t = setTimeout(() => {
        criarPopup(icon, title, body, url)
        dispararNotifSistema(title, body, url)
      }, delay)
      timers.current.push(t)
    })

    return () => timers.current.forEach(clearTimeout)
  }, [aluno])

  function criarPopup(icon, title, body, url) {
  if (!overlayRef.current) return
  const el = document.createElement('div')
  el.className = 'notif-popup'
  el.innerHTML = `
    <div class="notif-icon">${icon}</div>
    <div class="notif-content">
      <p class="notif-title">${title}</p>
      ${body ? `<p class="notif-body">${body}</p>` : ''}
    </div>
  `
  if (url) el.onclick = () => window.open(url, '_blank')
  overlayRef.current.appendChild(el)
  setTimeout(() => el.remove(), 4000)
}

  function dispararNotifSistema(title, body, url) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const n = new Notification(title, { body, icon: '/logo.png' })
      if (url) n.onclick = () => { window.open(url, '_blank'); n.close() }
    }
  }

  if (!aluno) return null

  return (
    <>
      <div className="notif-overlay" ref={overlayRef} />
      <section className="con-bg">
        <div className="con-card">
          <img src="/logo.png" alt="FiEB" className="con-logo" />

          <div className="con-success">
            <div className="con-check-icon">✓</div>
            <h2>Conectado com sucesso!</h2>
            <p className="con-username">Olá, <strong>{aluno.nome}</strong></p>
            <p className="con-rede">✓ Conectado à rede FiEB WiFi</p>
          </div>

          <div className="con-info-box">
            <p>📱 Você já pode minimizar esta página e navegar livremente!</p>
          </div>

          <button className="con-btn-green" onClick={() => window.location.href = 'https://www.google.com'}>
            Começar a navegar
          </button>


          <a
            href="#"
            className="con-disconnect"
            onClick={e => { e.preventDefault(); limparAluno(); navigate('/') }}
          >
            Desconectar da rede
          </a>
        </div>
      </section>
    </> 
  )
}