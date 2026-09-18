'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Eye, Paperclip, Trash2, X } from 'lucide-react'

export type Anexo = { nome: string; url?: string | null }

// Botão de anexo de uma linha: mostra quantos anexos tem e abre um painel
// pra anexar, ver e excluir. Excluir pede confirmação no próprio painel
// (sem window.confirm). Upload/remoção ficam com quem usa (onAnexar/onRemover).
export function AnexoButton({
  anexo,
  onAnexar,
  onRemover,
  accept = 'application/pdf,image/jpeg,image/png',
}: {
  anexo: Anexo | null
  onAnexar: (arquivo: File) => Promise<void>
  onRemover: () => Promise<void>
  accept?: string
}) {
  const [aberto, setAberto] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [enviando, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return
    const onClickFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', onClickFora)
    return () => document.removeEventListener('mousedown', onClickFora)
  }, [aberto])

  useEffect(() => { if (!aberto) setConfirmando(false) }, [aberto])

  const anexar = (arquivo: File) => {
    startTransition(async () => {
      await onAnexar(arquivo)
      setAberto(false)
    })
  }

  const remover = () => {
    startTransition(async () => {
      await onRemover()
      setConfirmando(false)
    })
  }

  return (
    <div ref={ref} className="relative inline-block" onClick={e => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setAberto(a => !a)}
        title={anexo?.nome ?? 'Anexar arquivo'}
        className={`flex items-center gap-1 rounded px-1.5 py-1 text-xs tabular-nums transition-colors hover:bg-muted ${anexo ? 'text-primary font-medium' : 'text-muted-foreground'}`}
      >
        <Paperclip size={13} />
        {anexo ? 1 : 0}
      </button>

      {aberto && (
        <div className="absolute right-0 top-full z-40 mt-1 w-64 rounded-xl border border-border bg-card p-3 text-left shadow-xl">
          {anexo ? (
            confirmando ? (
              <div className="mb-2 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2">
                <p className="text-xs text-foreground">Excluir <strong className="font-semibold">{anexo.nome}</strong>? Não dá para desfazer.</p>
                <div className="mt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setConfirmando(false)} className="rounded border border-border px-2 py-1 text-xs hover:bg-muted">Cancelar</button>
                  <button type="button" onClick={remover} disabled={enviando} className="rounded bg-destructive px-2 py-1 text-xs font-medium text-white disabled:opacity-50">
                    {enviando ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-md bg-muted px-2 py-1.5">
                <span className="truncate text-xs text-foreground" title={anexo.nome}>{anexo.nome}</span>
                <div className="flex shrink-0 items-center gap-1.5">
                  {anexo.url && (
                    <a href={anexo.url} target="_blank" rel="noopener noreferrer" title="Ver arquivo" className="text-muted-foreground hover:text-primary">
                      <Eye size={14} strokeWidth={1.75} />
                    </a>
                  )}
                  <button type="button" onClick={() => setConfirmando(true)} title="Excluir anexo" className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="mb-2 text-xs text-muted-foreground">Nenhum anexo</p>
          )}

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-2 py-2 text-xs text-muted-foreground hover:bg-muted">
            {enviando && !confirmando ? 'Enviando...' : anexo ? 'Substituir arquivo' : 'Escolher arquivo'}
            <input
              type="file"
              accept={accept}
              className="hidden"
              disabled={enviando}
              onChange={e => {
                const arquivo = e.target.files?.[0]
                if (arquivo) anexar(arquivo)
                e.target.value = ''
              }}
            />
          </label>

          <button type="button" onClick={() => setAberto(false)} className="mt-2 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <X size={11} /> Fechar
          </button>
        </div>
      )}
    </div>
  )
}
