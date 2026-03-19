import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { buscarAlunoPorEmail, cadastrarAluno } from '../services/supabase'
import { useAluno } from '../context/Alunocontext'
import './Cadastro.css'

import { validarEmail } from '../utils/validarEmail'

// dentro do handleConectar / handleCadastrar:

export default function Cadastro() {
  const navigate = useNavigate()
  const location = useLocation()
  const { salvarAluno } = useAluno()

  const [form, setForm] = useState({
    nome: '',
    email: location.state?.email || '',
    check1: false,
    check2: false,
  })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome.trim()) return setErro('Preencha seu nome.')
    if (!form.email.trim()) return setErro('Preencha seu e-mail.')
    const { valido, erro: erroEmail } = validarEmail(form.email)
    if (!valido) return setErro(erroEmail)
    if (!form.check1) return setErro('Aceite as Políticas de Privacidade e Termos de Uso.')

    setLoading(true)
    try {
      const existente = await buscarAlunoPorEmail(form.email.trim())
      if (existente) {
        setErro('E-mail já cadastrado. Volte e faça login.')
        return
      }

      const aluno = await cadastrarAluno({
        nome: form.nome.trim(),
        email: form.email.trim(),
        aceite_marketing: form.check2,
      })

      salvarAluno(aluno)
      navigate('/welcome')
    } catch (err) {
      setErro('Erro ao cadastrar. Tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cad-bg">
      <div className="cad-container">
        <img src="/logo.png" alt="FiEB" className="cad-logo" />

        <div className="cad-card">
          <p className="cad-desc">Preencha o formulário abaixo para se conectar à internet</p>

          <form onSubmit={handleSubmit} className="cad-form" noValidate>
            <input
              name="nome"
              type="text"
              placeholder="Nome completo"
              className="cad-input"
              value={form.nome}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              className="cad-input"
              value={form.email}
              onChange={handleChange}
            />

            {erro && <p className="cad-erro">{erro}</p>}

            <label className="cad-check">
              <input type="checkbox" name="check1" checked={form.check1} onChange={handleChange} />
              <span>
                Li e estou ciente das condições de tratamento de dados pessoais descritas nas{' '}
                <strong>Políticas de Privacidade</strong> e nos <strong>Termos de Uso</strong>.*
              </span>
            </label>

            <label className="cad-check">
              <input type="checkbox" name="check2" checked={form.check2} onChange={handleChange} />
              <span>
                Eu aceito que meus dados de contato sejam tratados para fins de e-mails e marketing.
              </span>
            </label>

            <button type="submit" className="cad-btn" disabled={loading}>
              {loading ? 'Cadastrando...' : 'CADASTRAR'}
            </button>

            <button type="button" className="cad-voltar" onClick={() => navigate('/')}>
              Voltar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}