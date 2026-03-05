import { createContext, useContext, useState } from 'react'

const AlunoContext = createContext(null)

export function AlunoProvider({ children }) {
  const [aluno, setAluno] = useState(() => {
    const saved = sessionStorage.getItem('alunoLogado')
    return saved ? JSON.parse(saved) : null
  })

  function salvarAluno(dados) {
    sessionStorage.setItem('alunoLogado', JSON.stringify(dados))
    setAluno(dados)
  }

  function limparAluno() {
    sessionStorage.removeItem('alunoLogado')
    sessionStorage.removeItem('fiebConectado')
    setAluno(null)
  }

  return (
    <AlunoContext.Provider value={{ aluno, salvarAluno, limparAluno }}>
      {children}
    </AlunoContext.Provider>
  )
}

export function useAluno() {
  return useContext(AlunoContext)
}