import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAluno } from '../context/Alunocontext'
import { supabase } from '../services/supabase'
import { registrarServiceWorker, gerarSubscription, salvarSubscription, dispararPushWelcome } from '../services/push'
import './Welcome.css'

export default function Welcome() {
  const navigate = useNavigate()
  const { aluno, limparAluno } = useAluno()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!aluno) navigate('/')
  }, [aluno])

  if (!aluno) return null

  // async function handleContinuar() {
  //   setLoading(true)
  //   try {
  //     const registro = await registrarServiceWorker()
  //     const subscription = await gerarSubscription(registro)
  //     await salvarSubscription(supabase, subscription)
  //     dispararPushWelcome().catch(console.error)
  //   } catch (err) {
  //     console.warn('Push não disponível:', err.message)
  //   } finally {
  //     setLoading(false)
  //     sessionStorage.setItem('fiebConectado', 'true')
  //     navigate('/conectado')
  //   }
  // }

  async function handleContinuar() {
  setLoading(true)
  try {
    // DEBUG TEMPORÁRIO
    if (!('serviceWorker' in navigator)) {
      alert('❌ Service Worker não suportado neste browser')
      setLoading(false)
      return
    }
    alert('✅ Service Worker suportado')

    if (!('Notification' in window)) {
      alert('❌ Notificações não suportadas')
      setLoading(false)
      return
    }
    alert(`🔔 Permissão atual: ${Notification.permission}`)

    const registro = await registrarServiceWorker()
    alert('✅ Service Worker registrado')

    const subscription = await gerarSubscription(registro)
    alert('✅ Subscription gerada')

    await salvarSubscription(supabase, subscription)
    alert('✅ Subscription salva no Supabase')

    dispararPushWelcome().catch(e => alert('❌ Erro no push: ' + e.message))

  } catch (err) {
    alert('❌ Erro: ' + err.message)
  } finally {
    setLoading(false)
    sessionStorage.setItem('fiebConectado', 'true')
    navigate('/conectado')
  }
}
  return (
    <section className="wlc-bg">
      <div className="wlc-card">
        <img src="/logo.png" alt="FiEB" className="wlc-logo" />

        <div className="wlc-info">
          <p className="wlc-subtitle">Bem-vindo(a) de volta,</p>
          <p className="wlc-nome">{aluno.nome}</p>
          <p className="wlc-detail">Turma: <span>{aluno.turma}</span></p>
          <p className="wlc-detail">Sua sala é a <strong>{aluno.sala}</strong></p>
          
            <a href="#"
            className="wlc-notuser"
            onClick={e => { e.preventDefault(); limparAluno(); navigate('/') }}
          >
            Não sou {aluno.nome}
          </a>
        </div>

        <label className="wlc-check">
          <input type="checkbox" defaultChecked />
          <span>Li e estou ciente das condições de tratamento de dados pessoais descritas nas <strong>Políticas de Privacidade</strong> e nos <strong>Termos de Uso</strong>.</span>
        </label>

        <label className="wlc-check">
          <input type="checkbox" />
          <span>Eu aceito que meus dados de contato sejam tratados para fins de e-mails e marketing.</span>
        </label>

        <button className="wlc-btn" onClick={handleContinuar} disabled={loading}>
          {loading ? <span className="wlc-spinner" /> : 'Continuar'}
        </button>
      </div>
    </section>
  )
}