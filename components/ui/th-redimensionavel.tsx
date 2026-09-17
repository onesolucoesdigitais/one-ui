'use client'

import { useEffect, useRef, useState } from 'react'

const LARGURA_MINIMA = 70

// Cabeçalho de coluna com uma alcinha de arrastar na borda direita — a
// largura muda em tempo real durante o arraste (sem gravar a cada pixel) e
// só persiste (via onResize) quando solta o mouse.
export function ThRedimensionavel({ largura, onResize, className, children }: {
  largura: number; onResize: (px: number) => void; className?: string; children: React.ReactNode
}) {
  const [larguraAtual, setLarguraAtual] = useState(largura)
  const arrastandoRef = useRef<{ x: number; largura: number } | null>(null)

  useEffect(() => { setLarguraAtual(largura) }, [largura])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    arrastandoRef.current = { x: e.clientX, largura: larguraAtual }
    const onMove = (ev: MouseEvent) => {
      if (!arrastandoRef.current) return
      const nova = Math.max(LARGURA_MINIMA, arrastandoRef.current.largura + (ev.clientX - arrastandoRef.current.x))
      setLarguraAtual(nova)
    }
    const onUp = (ev: MouseEvent) => {
      if (arrastandoRef.current) {
        const nova = Math.max(LARGURA_MINIMA, arrastandoRef.current.largura + (ev.clientX - arrastandoRef.current.x))
        onResize(nova)
      }
      arrastandoRef.current = null
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <th className={`relative select-none ${className ?? ''}`} style={{ width: larguraAtual, minWidth: larguraAtual, maxWidth: larguraAtual }}>
      <div className="whitespace-normal break-words leading-tight">{children}</div>
      <span
        onMouseDown={onMouseDown}
        className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize hover:bg-primary/40 active:bg-primary/60 z-10"
      />
    </th>
  )
}
