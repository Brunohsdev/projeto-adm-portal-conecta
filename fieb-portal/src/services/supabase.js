import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ===== FUNÇÕES DE ALUNO =====

export async function buscarAlunoPorEmail(email) {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function cadastrarAluno({ nome, email, aceite_marketing }) {
  const sala = gerarSala()

  const { data, error } = await supabase
    .from('alunos')
    .insert([{
      nome,
      email: email.toLowerCase(),
      turma: '93313',
      sala,
      aceite_marketing
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarSala(email) {
  const sala = gerarSala()

  const { data, error } = await supabase
    .from('alunos')
    .update({ sala })
    .eq('email', email.toLowerCase())
    .select()
    .single()

  if (error) throw error
  return data
}

// ===== HELPERS =====

function gerarSala() {
  const letras = 'ABCDEFGHIJKLMN'
  const letra = letras[Math.floor(Math.random() * letras.length)]
  const numero = Math.floor(Math.random() * 10) + 1
  return `${letra}${numero}`
}