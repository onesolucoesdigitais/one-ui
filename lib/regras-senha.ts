// Regras de senha, iguais em toda tela que cria ou troca senha (cadastro,
// nova senha, troca obrigatória, colaborador, acesso de cliente). Antes cada
// tela tinha a sua (6 ou 8 caracteres) e a pessoa só descobria o problema
// depois de enviar. Aprovado pelo Klinger em 2026-09-29 (prévia com ✓).
// Senha que já existe não é cobrada: só vale ao criar ou trocar.

export interface RegraSenha {
  id: 'tamanho' | 'maiuscula' | 'minuscula' | 'numero' | 'especial'
  rotulo: string
  atende: (senha: string) => boolean
}

export const TAMANHO_MINIMO_SENHA = 8

export const REGRAS_SENHA: readonly RegraSenha[] = [
  { id: 'tamanho', rotulo: `Pelo menos ${TAMANHO_MINIMO_SENHA} caracteres`, atende: s => s.length >= TAMANHO_MINIMO_SENHA },
  { id: 'maiuscula', rotulo: 'Uma letra maiúscula (A–Z)', atende: s => /[A-ZÀ-Ý]/.test(s) },
  { id: 'minuscula', rotulo: 'Uma letra minúscula (a–z)', atende: s => /[a-zß-ÿ]/.test(s) },
  { id: 'numero', rotulo: 'Um número (0–9)', atende: s => /\d/.test(s) },
  { id: 'especial', rotulo: 'Um caractere especial (! @ # $ % & *)', atende: s => /[^A-Za-zÀ-ÿ0-9\s]/.test(s) },
]

export function senhaAtendeRegras(senha: string): boolean {
  return REGRAS_SENHA.every(r => r.atende(senha))
}

// Mensagem pra quando a pessoa tenta enviar sem cumprir tudo.
export function erroSenha(senha: string): string | null {
  if (!senha) return 'Preencha uma senha'
  const faltando = REGRAS_SENHA.filter(r => !r.atende(senha))
  if (faltando.length === 0) return null
  return `A senha ainda precisa de: ${faltando.map(r => r.rotulo.toLowerCase()).join(', ')}`
}

// Senha inicial que o master repassa pro colaborador/cliente. Sai com um de
// cada tipo e embaralhada; sem caracteres que confundem (0/O, 1/l/I).
const GRUPOS = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghjkmnpqrstuvwxyz', '23456789', '!@#$%&*']

function sortear(max: number): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

export function gerarSenhaForte(tamanho = 10): string {
  const todos = GRUPOS.join('')
  const chars = GRUPOS.map(g => g[sortear(g.length)])
  while (chars.length < tamanho) chars.push(todos[sortear(todos.length)])
  for (let i = chars.length - 1; i > 0; i--) {
    const j = sortear(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}
