'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export type PassoTour = {
  seletor: string // valor do atributo data-tour do elemento destacado
  titulo: string
  texto: string
}

const MARGEM = 8
const LARGURA_CARD = 340

// Tour guiado: escurece a tela, recorta o elemento com data-tour="<seletor>"
// e mostra um card com o passo. O passo atual é controlado por quem usa.
export function TourOverlay({ passos, passo, onProximo, onAnterior, onEncerrar }: {
  passos: PassoTour[]
  passo: number | null
  onProximo: () => void
  onAnterior: () => void
  onEncerrar: () => void
}) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const atual = passo !== null ? passos[passo] : null

  useEffect(() => {
    if (!atual) { setRect(null); return }
    setRect(null)
    let cancelado = false
    let tentativas = 0
    const tentar = () => {
      if (cancelado) return
      const el = document.querySelector(`[data-tour="${atual.seletor}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => { if (!cancelado) setRect(el.getBoundingClientRect()) }, 300)
      } else if (tentativas < 20) {
        tentativas++
        setTimeout(tentar, 150)
      }
    }
    tentar()
    return () => { cancelado = true }
  }, [atual])

  useEffect(() => {
    if (!atual) return
    const atualizar = () => {
      const el = document.querySelector(`[data-tour="${atual.seletor}"]`)
      if (el) setRect(el.getBoundingClientRect())
    }
    const onTecla = (e: KeyboardEvent) => { if (e.key === 'Escape') onEncerrar() }
    window.addEventListener('scroll', atualizar, true)
    window.addEventListener('resize', atualizar)
    window.addEventListener('keydown', onTecla)
    return () => {
      window.removeEventListener('scroll', atualizar, true)
      window.removeEventListener('resize', atualizar)
      window.removeEventListener('keydown', onTecla)
    }
  }, [atual, onEncerrar])

  if (!atual || passo === null) return null

  const caixa = rect && {
    top: rect.top - MARGEM,
    left: rect.left - MARGEM,
    width: rect.width + MARGEM * 2,
    height: rect.height + MARGEM * 2,
  }
  const largura = Math.min(LARGURA_CARD, window.innerWidth - 32)
  const topo = caixa ? Math.min(caixa.top + caixa.height + 12, window.innerHeight - 220) : window.innerHeight / 2 - 100
  const esquerda = caixa ? Math.min(Math.max(caixa.left, 16), window.innerWidth - largura - 16) : window.innerWidth / 2 - largura / 2
  const ultimo = passo + 1 === passos.length

  return (
    <div className="fixed inset-0 z-[200]" style={{ pointerEvents: 'none' }}>
      {caixa && (
        <div
          className="fixed rounded-lg border-[3px] border-primary"
          style={{ ...caixa, boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)', transition: 'top .25s ease, left .25s ease, width .25s ease, height .25s ease' }}
        />
      )}
      <div className="fixed rounded-lg bg-card p-4 text-card-foreground shadow-xl" style={{ pointerEvents: 'auto', top: topo, left: esquerda, width: largura }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Passo {passo + 1} de {passos.length}</span>
          <button type="button" onClick={onEncerrar} title="Fechar tour" className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <h3 className="mb-1 text-sm font-bold">{atual.titulo}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{atual.texto}</p>
        <div className="flex items-center justify-between">
          <button type="button" onClick={onEncerrar} className="text-xs text-muted-foreground hover:text-foreground">Pular tour</button>
          <div className="flex gap-2">
            {passo > 0 && <button type="button" onClick={onAnterior} className="rounded border border-border px-3 py-1.5 text-xs">Anterior</button>}
            <button type="button" onClick={ultimo ? onEncerrar : onProximo} className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              {ultimo ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
