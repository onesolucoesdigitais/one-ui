export type CampoFiltro = {
  key: string
  label: string
  opcoes: { value: string; label: string }[]
}

export type Condicao = {
  id: string
  campo: string
  modo: 'mostrar' | 'ocultar'
  valor: string
}

// Mapeia a chave lógica do campo (usada na UI) pro nome real da propriedade
// no objeto do lançamento — mesmos nomes em Contas a Pagar e Contas a
// Receber, então a lógica de avaliação é genérica pras duas telas.
const CAMPO_PARA_PROP: Record<string, string> = {
  tipo: 'regularidade',
  grupo_custo: 'grupo_custo_id',
  centro_custo: 'centro_custo_id',
  categoria: 'categoria_id',
  contato: 'contato_id',
  banco: 'conta_bancaria_id',
}

// Todas as condições combinam com E — cada uma precisa bater (ou não bater,
// se o modo for "ocultar") pro lançamento entrar na lista.
export function passaNosFiltros(l: Record<string, any>, condicoes: Condicao[]): boolean {
  return condicoes.every(c => {
    if (!c.valor) return true // condição incompleta (campo/valor ainda não escolhido) não filtra nada
    const bate = String(l[CAMPO_PARA_PROP[c.campo]] ?? '') === c.valor
    return c.modo === 'mostrar' ? bate : !bate
  })
}
