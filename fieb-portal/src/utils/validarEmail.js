// Domínios aceitos pelo sistema FiEB
const DOMINIOS_ACEITOS = [
  '@gmail.com',
  '@ba.estudante.senai.br',
  '@professor.senai.com.br',
  '@hotmail.com',
  '@outlook.com',
  '@yahoo.com',
]

export function validarEmail(email) {
  const e = email.toLowerCase().trim()

  // Formato básico
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  if (!formatoValido) {
    return { valido: false, erro: 'E-mail inválido.' }
  }

  // Verifica se é um dos domínios aceitos
  const dominioAceito = DOMINIOS_ACEITOS.some(d => e.endsWith(d))
  if (!dominioAceito) {
    return {
      valido: false,
      erro: `Domínio não aceito. Use um e-mail @gmail.com, @ba.estudante.senai.br ou @professor.senai.com.br.`
    }
  }

  // Bloqueia e-mails com números demais antes do @ (padrão matrícula)
  const usuario = e.split('@')[0]
  if (/^\d+$/.test(usuario)) {
    return { valido: false, erro: 'Use seu e-mail pessoal, não sua matrícula.' }
  }

  return { valido: true, erro: null }
}