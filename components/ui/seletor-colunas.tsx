'use client'

import { useEffect, useRef, useState } from 'react'
import { Columns3, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export type ColunaDef = { key: string; label: string }
export type ColunaEstado = ColunaDef & { visivel: boolean; largura?: number }

function LinhaColuna({ coluna, onToggle }: { coluna: ColunaEstado; onToggle: (key: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: coluna.key })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50">
      <button {...attributes} {...listeners} className="text-muted-foreground cursor-grab active:cursor-grabbing touch-none" type="button">
        <GripVertical size={14} />
      </button>
      <label className="flex items-center gap-2 text-sm flex-1 cursor-pointer select-none">
        <input type="checkbox" checked={coluna.visivel} onChange={() => onToggle(coluna.key)} className="rounded" />
        {coluna.label}
      </label>
    </div>
  )
}

// Botão + popover pra escolher quais colunas aparecem numa tabela e em que
// ordem — preferência salva por usuário+cliente+tela (ver useColunasConfiguraveis).
export function SeletorColunas({ colunas, onToggle, onReordenar }: {
  colunas: ColunaEstado[]
  onToggle: (key: string) => void
  onReordenar: (novaOrdemKeys: string[]) => void
}) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  useEffect(() => {
    if (!aberto) return
    const onClickFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', onClickFora)
    return () => document.removeEventListener('mousedown', onClickFora)
  }, [aberto])

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = colunas.findIndex(c => c.key === active.id)
    const newIndex = colunas.findIndex(c => c.key === over.id)
    onReordenar(arrayMove(colunas, oldIndex, newIndex).map(c => c.key))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setAberto(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors"
      >
        <Columns3 size={14} /> Colunas
      </button>
      {aberto && (
        <div className="absolute right-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-30 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground px-2 pb-1.5">
            Mostrar e reordenar
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={colunas.map(c => c.key)} strategy={verticalListSortingStrategy}>
              {colunas.map(c => <LinhaColuna key={c.key} coluna={c} onToggle={onToggle} />)}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
