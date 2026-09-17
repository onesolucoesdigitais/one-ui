import type { ReactNode } from 'react'

// Cores semânticas com fallback: usa --success/--warning do projeto quando
// existirem, senão um tom padrão legível nos temas claro e escuro.
const TONS = {
  neutro: { ponto: 'var(--muted-foreground)', valor: 'var(--foreground)' },
  positivo: { ponto: 'var(--success, #2E9B5C)', valor: 'var(--success, #2E9B5C)' },
  negativo: { ponto: 'var(--destructive, #C13B3B)', valor: 'var(--destructive, #C13B3B)' },
  alerta: { ponto: 'var(--warning, #D9A400)', valor: 'var(--foreground)' },
  info: { ponto: 'var(--primary)', valor: 'var(--foreground)' },
} as const

export type StatTom = keyof typeof TONS

// Card de indicador: rótulo, valor em destaque, detalhe opcional e uma
// bolinha de cor pelo significado (positivo, negativo, alerta...).
export function StatCard({ label, valor, detalhe, tom = 'neutro', icone }: {
  label: string
  valor: ReactNode
  detalhe?: ReactNode
  tom?: StatTom
  icone?: ReactNode
}) {
  const cor = TONS[tom]
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        {icone ?? <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cor.ponto }} />}
      </div>
      <div className="text-xl font-bold leading-tight tabular-nums" style={{ color: cor.valor }}>{valor}</div>
      {detalhe && <p className="text-xs text-muted-foreground">{detalhe}</p>}
    </div>
  )
}
