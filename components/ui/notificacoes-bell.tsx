'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'

export type Notificacao = {
  id: string
  titulo: string
  descricao?: string
  criadaEm: string // ISO com horário
  lida: boolean
}

function tempoRelativo(iso: string) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `${min}min atrás`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

// Sino com contador de não lidas e painel de notificações. Não busca nada
// sozinho: quem usa passa a lista e decide o que acontece ao abrir/limpar.
const LARGURA_PAINEL = 320

export function NotificacoesBell({ notificacoes, onAbrir, onMarcarTodasLidas, lado = 'direita' }: {
  notificacoes: Notificacao[]
  onAbrir: (n: Notificacao) => void
  onMarcarTodasLidas: () => void
  /** De que lado do botão o painel abre — use 'direita' na barra de cima e 'esquerda' num menu lateral estreito. */
  lado?: 'direita' | 'esquerda'
}) {
  const [aberto, setAberto] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const naoLidas = notificacoes.filter(n => !n.lida).length

  // Painel em posição fixa, calculada a partir do botão: assim ele nunca é
  // cortado por um menu estreito (ou por qualquer container com overflow).
  const abrir = () => {
    const r = botaoRef.current?.getBoundingClientRect()
    if (r) {
      const bruto = lado === 'esquerda' ? r.right + 8 : r.right - LARGURA_PAINEL
      const left = Math.min(Math.max(8, bruto), window.innerWidth - LARGURA_PAINEL - 8)
      setPos({ top: r.bottom + 8, left })
    }
    setAberto(a => !a)
  }

  useEffect(() => {
    if (!aberto) return
    const onClickFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', onClickFora)
    return () => document.removeEventListener('mousedown', onClickFora)
  }, [aberto])

  return (
    <div ref={ref} className="relative">
      <button
        ref={botaoRef}
        type="button"
        onClick={abrir}
        title="Notificações"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        <Bell size={16} />
        {naoLidas > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white tabular-nums">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div
          className="fixed z-50 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          style={{ top: pos.top, left: pos.left, width: LARGURA_PAINEL }}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notificações</p>
            {naoLidas > 0 && (
              <button type="button" onClick={onMarcarTodasLidas} className="text-xs font-medium text-primary hover:underline">
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-90 overflow-y-auto">
            {notificacoes.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">Nenhuma notificação por aqui.</p>
            ) : (
              notificacoes.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => { setAberto(false); onAbrir(n) }}
                  className={`flex w-full items-start gap-2.5 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted ${n.lida ? '' : 'bg-primary/5'}`}
                >
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.lida ? 'bg-transparent' : 'bg-primary'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs text-foreground ${n.lida ? '' : 'font-semibold'}`}>{n.titulo}</p>
                    {n.descricao && <p className="mt-0.5 text-xs text-muted-foreground">{n.descricao}</p>}
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{tempoRelativo(n.criadaEm)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
