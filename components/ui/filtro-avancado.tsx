'use client'

import { useEffect, useRef, useState } from 'react'
import { Filter, Plus, X } from 'lucide-react'
import type { CampoFiltro, Condicao } from '@/lib/filtro-avancado'

// Painel de filtros combináveis (estilo Notion): cada condição é
// campo + mostrar/ocultar + valor, e todas combinam com E.
export function FiltroAvancado({ campos, condicoes, onChange }: {
  campos: CampoFiltro[]
  condicoes: Condicao[]
  onChange: (condicoes: Condicao[]) => void
}) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return
    const onClickFora = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false) }
    document.addEventListener('mousedown', onClickFora)
    return () => document.removeEventListener('mousedown', onClickFora)
  }, [aberto])

  const adicionar = () => {
    if (campos.length === 0) return
    onChange([...condicoes, { id: crypto.randomUUID(), campo: campos[0].key, modo: 'mostrar', valor: '' }])
  }

  const atualizar = (id: string, patch: Partial<Condicao>) => {
    onChange(condicoes.map(c => (c.id === id ? { ...c, ...patch } : c)))
  }

  const remover = (id: string) => onChange(condicoes.filter(c => c.id !== id))

  const ativos = condicoes.filter(c => c.valor).length

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAberto(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors"
      >
        <Filter size={14} /> Filtros{ativos > 0 && ` (${ativos})`}
      </button>

      {aberto && (
        <div className="absolute right-0 mt-1 w-[440px] bg-card border border-border rounded-lg shadow-lg z-30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-1 pb-2">
            Filtrar por
          </p>

          {condicoes.length === 0 && (
            <p className="text-sm text-muted-foreground px-1 pb-2">Nenhum filtro ativo.</p>
          )}

          <div className="space-y-2">
            {condicoes.map(c => {
              const campo = campos.find(cp => cp.key === c.campo) ?? campos[0]
              return (
                <div key={c.id} className="flex items-center gap-1.5">
                  <select
                    value={c.campo}
                    onChange={e => atualizar(c.id, { campo: e.target.value, valor: '' })}
                    className="rounded-md border border-border px-2 py-1.5 text-xs bg-card flex-shrink-0 w-28"
                  >
                    {campos.map(cp => <option key={cp.key} value={cp.key}>{cp.label}</option>)}
                  </select>
                  <select
                    value={c.modo}
                    onChange={e => atualizar(c.id, { modo: e.target.value as Condicao['modo'] })}
                    className="rounded-md border border-border px-2 py-1.5 text-xs bg-card flex-shrink-0 w-24"
                  >
                    <option value="mostrar">Mostrar</option>
                    <option value="ocultar">Ocultar</option>
                  </select>
                  <select
                    value={c.valor}
                    onChange={e => atualizar(c.id, { valor: e.target.value })}
                    className="rounded-md border border-border px-2 py-1.5 text-xs bg-card flex-1 min-w-0"
                  >
                    <option value="">Selecione...</option>
                    {campo?.opcoes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <button type="button" onClick={() => remover(c.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>

          <button type="button" onClick={adicionar} className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-3 px-1">
            <Plus size={12} /> Adicionar filtro
          </button>
        </div>
      )}
    </div>
  )
}
