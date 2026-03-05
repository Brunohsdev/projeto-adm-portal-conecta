import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buscarAlunoPorEmail, atualizarSala } from '../services/supabase'
import {useAluno} from '../context/Alunocontext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { salvarAluno } = useAluno()
  const [email, setEmail] = useState('')
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConectar(e) {
    e.preventDefault()
    setErro('')
    if (!email.trim()) return setErro('Preencha seu e-mail.')
    if (!check1) return setErro('Aceite as Políticas de Privacidade e Termos de Uso.')
    setLoading(true)
    try {
      const aluno = await buscarAlunoPorEmail(email.trim())
      if (!aluno) {
        navigate('/cadastro', { state: { email: email.trim() } })
        return
      }
      const atualizado = await atualizarSala(aluno.email)
      salvarAluno(atualizado)
      navigate('/welcome')
    } catch (err) {
      setErro('Erro ao conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-bg">
      <div className="login-card">
        <img src="../logo.png" alt="FiEB" className="login-logo" />
        <form onSubmit={handleConectar} className="login-form" noValidate>
          <button type="button" className="btn-facebook">
            <img src="../face.png" alt="" />
            Conectar usando o Facebook
          </button>
          <div className="divider"><span>ou</span></div>
          <input
            type="email"
            placeholder="E-mail"
            className="login-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {erro && <p className="login-erro">{erro}</p>}
          <label className="login-check">
            <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)} />
            <span>Li e estou ciente das condições de tratamento de dados pessoais descritas nas <strong>Políticas de Privacidade</strong> e nos <strong>Termos de Uso</strong>.*</span>
          </label>
          <label className="login-check">
            <input type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)} />
            <span>Eu aceito que meus dados de contato sejam tratados para fins de e-mails e marketing.</span>
          </label>
          <button type="submit" className="btn-conectar" disabled={loading}>
            {loading ? 'Verificando...' : 'Conectar'}
          </button>
          <p className="login-register">
            Não é registrado? <a onClick={() => navigate('/cadastro')}>Registre-se aqui</a>
          </p>
        </form>
      </div>
    </section>
  )
}