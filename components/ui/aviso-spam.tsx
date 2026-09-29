import { TriangleAlert } from 'lucide-react'

// Caixa "olhe no Spam" das telas que dizem que um e-mail foi enviado. Antes
// era uma linha cinza pequena que ninguém via — e os e-mails de confirmação
// e de senha ainda caem no spam com frequência (remetente novo, 2026-09).
export function AvisoSpam({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div role="note" className="w-full flex gap-3 items-start text-left rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3">
      <TriangleAlert size={20} className="text-amber-600 shrink-0 mt-0.5" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-amber-900">{titulo}</p>
        <p className="text-[13px] text-amber-800 leading-relaxed mt-0.5">{children}</p>
      </div>
    </div>
  )
}
