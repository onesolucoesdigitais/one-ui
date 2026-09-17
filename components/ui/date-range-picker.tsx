'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES_NOME = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export type DateRange = { inicio: string; fim: string } | null

const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const fromISO = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const formatBR = (s: string) => { const d = fromISO(s); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` }

function limitesDoMes(ano: number, mes: number) {
  return { inicio: toISO(new Date(ano, mes, 1)), fim: toISO(new Date(ano, mes + 1, 0)) }
}

function diasDoGrid(ano: number, mes: number) {
  const primeiro = new Date(ano, mes, 1)
  const inicioGrid = new Date(ano, mes, 1 - primeiro.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicioGrid)
    d.setDate(inicioGrid.getDate() + i)
    return d
  })
}

export function DateRangePicker({ value, onChange, mode = 'range', placeholder = 'Selecione o período' }: {
  value: DateRange
  onChange: (range: DateRange) => void
  mode?: 'range' | 'month'
  placeholder?: string
}) {
  const [aberto, setAberto] = useState(false)
  const [pendInicio, setPendInicio] = useState<string | null>(value?.inicio ?? null)
  const [pendFim, setPendFim] = useState<string | null>(value?.fim ?? null)
  const [hover, setHover] = useState<string | null>(null)
  const hoje = new Date()
  const [painelAno, setPainelAno] = useState(hoje.getFullYear())
  const [painelMes, setPainelMes] = useState(hoje.getMonth())
  const [escolhendoMes, setEscolhendoMes] = useState(false)
  const [anoEscolhaMes, setAnoEscolhaMes] = useState(hoje.getFullYear())
  const [alinharDireita, setAlinharDireita] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const aoClicarFora = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false) }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  useEffect(() => {
    if (!aberto) return
    setPendInicio(value?.inicio ?? null)
    setPendFim(value?.fim ?? null)
    const base = value?.inicio ? fromISO(value.inicio) : hoje
    setPainelAno(base.getFullYear())
    setPainelMes(base.getMonth())
    setEscolhendoMes(false)

    // O painel (2 calendários + atalhos no modo "range") é bem mais largo
    // que o botão que o abre — se ele nascer ancorado à direita (right-0)
    // num botão perto da borda esquerda da tela, a parte esquerda do
    // painel (primeiro calendário) fica cortada pra fora da viewport.
    // Decide o lado com espaço de sobra na hora de abrir.
    const larguraPainel = mode === 'month' ? 260 : 680
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setAlinharDireita(rect.right - larguraPainel < 8 && window.innerWidth - rect.left >= larguraPainel ? false : true)
  }, [aberto])

  const clicarDia = (iso: string) => {
    if (!pendInicio || (pendInicio && pendFim)) { setPendInicio(iso); setPendFim(null) }
    else if (iso < pendInicio) { setPendFim(pendInicio); setPendInicio(iso) }
    else setPendFim(iso)
  }

  const escolherMes = (ano: number, mes: number) => {
    const { inicio, fim } = limitesDoMes(ano, mes)
    setPendInicio(inicio)
    setPendFim(fim)
  }

  const diasRelativos = (offset: number) => {
    const d = new Date(hoje); d.setDate(hoje.getDate() + offset)
    const iso = toISO(d)
    setPendInicio(iso); setPendFim(iso)
  }

  const atalhos = [
    { label: 'Hoje', fn: () => diasRelativos(0) },
    { label: 'Ontem', fn: () => diasRelativos(-1) },
    { label: 'Anteontem', fn: () => diasRelativos(-2) },
    { label: 'Amanhã', fn: () => diasRelativos(1) },
    { label: 'Esta semana', fn: () => {
      const inicio = new Date(hoje); inicio.setDate(hoje.getDate() - hoje.getDay())
      const fim = new Date(inicio); fim.setDate(inicio.getDate() + 6)
      setPendInicio(toISO(inicio)); setPendFim(toISO(fim))
    } },
    { label: 'Semana passada', fn: () => {
      const fim = new Date(hoje); fim.setDate(hoje.getDate() - hoje.getDay() - 1)
      const inicio = new Date(fim); inicio.setDate(fim.getDate() - 6)
      setPendInicio(toISO(inicio)); setPendFim(toISO(fim))
    } },
    { label: 'Este mês', fn: () => escolherMes(hoje.getFullYear(), hoje.getMonth()) },
    { label: 'Mês passado', fn: () => { const d = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1); escolherMes(d.getFullYear(), d.getMonth()) } },
  ]

  const confirmar = () => {
    if (!pendInicio) { onChange(null); setAberto(false); return }
    onChange({ inicio: pendInicio, fim: pendFim ?? pendInicio })
    setAberto(false)
  }

  const limpar = () => { onChange(null); setAberto(false) }

  const label = value
    ? (mode === 'month' ? `${MESES_NOME[fromISO(value.inicio).getMonth()]} de ${fromISO(value.inicio).getFullYear()}` : `${formatBR(value.inicio)} até ${formatBR(value.fim)}`)
    : placeholder

  const painelSeguinteMes = (painelMes + 1) % 12
  const painelSeguinteAno = painelMes === 11 ? painelAno + 1 : painelAno

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setAberto(o => !o)}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/50 transition-colors bg-card whitespace-nowrap">
        <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
        {label}
      </button>

      {aberto && (
        <div className={`absolute z-50 mt-1 ${alinharDireita ? 'right-0' : 'left-0'} max-w-[calc(100vw-1rem)] overflow-x-auto bg-card border border-border rounded-xl shadow-xl p-4 flex flex-col gap-4`}>
          <div className="flex gap-4">
            {mode === 'month' ? (
              <div className="w-56">
                <MesGrid ano={painelAno} onAno={setPainelAno} selecionado={pendInicio ? fromISO(pendInicio) : null} onEscolher={escolherMes} />
              </div>
            ) : (
              <>
                <MiniCalendario
                  ano={painelAno} mes={painelMes}
                  onNav={() => { const d = new Date(painelAno, painelMes - 1, 1); setPainelAno(d.getFullYear()); setPainelMes(d.getMonth()) }}
                  navDirecao="prev"
                  pendInicio={pendInicio} pendFim={pendFim} hover={hover} setHover={setHover} onClickDia={clicarDia}
                />
                <MiniCalendario
                  ano={painelSeguinteAno} mes={painelSeguinteMes}
                  onNav={() => { const d = new Date(painelSeguinteAno, painelSeguinteMes + 1, 1); setPainelAno(d.getFullYear()); setPainelMes(d.getMonth() === 0 ? 11 : d.getMonth() - 1) }}
                  navDirecao="next"
                  pendInicio={pendInicio} pendFim={pendFim} hover={hover} setHover={setHover} onClickDia={clicarDia}
                />
                <div className="w-36 border-l border-border pl-4">
                  {escolhendoMes ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setEscolhendoMes(false)}
                        className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 hover:text-foreground"
                      >
                        <ChevronLeft size={12} /> Voltar
                      </button>
                      <MesGrid
                        ano={anoEscolhaMes}
                        onAno={setAnoEscolhaMes}
                        selecionado={pendInicio ? fromISO(pendInicio) : null}
                        onEscolher={(ano, mes) => { escolherMes(ano, mes); setEscolhendoMes(false) }}
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Atalhos</div>
                      <div className="space-y-0.5">
                        {atalhos.map(a => (
                          <button key={a.label} type="button" onClick={a.fn}
                            className="block w-full text-left text-sm text-foreground/80 hover:text-primary py-1 transition-colors">
                            {a.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => { setAnoEscolhaMes(pendInicio ? fromISO(pendInicio).getFullYear() : hoje.getFullYear()); setEscolhendoMes(true) }}
                          className="flex items-center justify-between w-full text-left text-sm text-foreground/80 hover:text-primary py-1 transition-colors"
                        >
                          Escolher mês <ChevronRight size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
            <button type="button" onClick={limpar} className="text-xs text-muted-foreground hover:text-foreground">
              Limpar filtro
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAberto(false)} className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button type="button" onClick={confirmar} disabled={!pendInicio}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                Filtrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MiniCalendario({ ano, mes, onNav, navDirecao, pendInicio, pendFim, hover, setHover, onClickDia }: {
  ano: number; mes: number; onNav: () => void; navDirecao: 'prev' | 'next'
  pendInicio: string | null; pendFim: string | null; hover: string | null
  setHover: (iso: string | null) => void; onClickDia: (iso: string) => void
}) {
  const dias = diasDoGrid(ano, mes)
  const fimEfetivo = pendFim ?? hover
  const emRange = (iso: string) => {
    if (!pendInicio) return false
    if (!fimEfetivo) return iso === pendInicio
    const [lo, hi] = pendInicio < fimEfetivo ? [pendInicio, fimEfetivo] : [fimEfetivo, pendInicio]
    return iso >= lo && iso <= hi
  }
  const isPonta = (iso: string) => iso === pendInicio || iso === pendFim

  return (
    <div className="w-56">
      <div className="flex items-center justify-between mb-2 px-1">
        {navDirecao === 'prev' ? (
          <button type="button" onClick={onNav} className="text-muted-foreground hover:text-foreground"><ChevronLeft size={16} /></button>
        ) : <span className="w-4" />}
        <span className="text-sm font-semibold">{MESES_NOME[mes]} {ano}</span>
        {navDirecao === 'next' ? (
          <button type="button" onClick={onNav} className="text-muted-foreground hover:text-foreground"><ChevronRight size={16} /></button>
        ) : <span className="w-4" />}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DIAS_SEMANA.map(d => <div key={d} className="text-[10px] text-muted-foreground font-medium py-1">{d}</div>)}
        {dias.map(d => {
          const iso = toISO(d)
          const foraDoMes = d.getMonth() !== mes
          const range = emRange(iso)
          const ponta = isPonta(iso)
          return (
            <button
              key={iso}
              type="button"
              disabled={foraDoMes}
              onMouseEnter={() => setHover(iso)}
              onClick={() => onClickDia(iso)}
              className={`text-xs py-1.5 rounded-md transition-colors ${
                foraDoMes ? 'text-muted-foreground/30 cursor-default' :
                ponta ? 'bg-primary text-primary-foreground font-semibold' :
                range ? 'bg-success/15 text-foreground' :
                'hover:bg-muted text-foreground'
              }`}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MesGrid({ ano, onAno, selecionado, onEscolher }: {
  ano: number; onAno: (ano: number) => void; selecionado: Date | null; onEscolher: (ano: number, mes: number) => void
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <button type="button" onClick={() => onAno(ano - 1)} className="text-muted-foreground hover:text-foreground"><ChevronLeft size={16} /></button>
        <span className="text-sm font-semibold">{ano}</span>
        <button type="button" onClick={() => onAno(ano + 1)} className="text-muted-foreground hover:text-foreground"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {MESES_ABREV.map((m, i) => {
          const ativo = selecionado?.getFullYear() === ano && selecionado?.getMonth() === i
          return (
            <button
              key={m}
              type="button"
              onClick={() => onEscolher(ano, i)}
              className={`text-sm py-2 rounded-md transition-colors ${ativo ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'}`}
            >
              {m}
            </button>
          )
        })}
      </div>
    </div>
  )
}
