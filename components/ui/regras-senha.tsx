import { Check } from 'lucide-react'
import { REGRAS_SENHA } from '@/lib/regras-senha'

// Lista "Sua senha precisa ter:" com ✓ que marca enquanto a pessoa digita.
// `tema="auth"` = telas públicas (fundo claro fixo); `tema="app"` = dentro do
// sistema, onde as cores seguem o tema escolhido pelo usuário.
export function RegrasSenha({ senha, tema = 'auth' }: { senha: string; tema?: 'auth' | 'app' }) {
  const auth = tema === 'auth'
  return (
    <div
      aria-live="polite"
      className={`rounded-xl px-3.5 py-3 border ${auth ? 'bg-white border-slate-900/10' : 'bg-muted/40 border-border'}`}
    >
      <p className={`text-xs font-semibold mb-2 ${auth ? 'text-slate-600' : 'text-muted-foreground'}`}>Sua senha precisa ter:</p>
      <ul className="space-y-1.5">
        {REGRAS_SENHA.map(regra => {
          const ok = regra.atende(senha)
          return (
            <li key={regra.id} className={`flex items-center gap-2 text-[13px] transition-colors ${ok ? (auth ? 'text-emerald-700' : 'text-emerald-700 dark:text-emerald-400') : auth ? 'text-slate-500' : 'text-muted-foreground'}`}>
              <span
                aria-hidden
                className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 border-[1.5px] transition-colors ${ok ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400 text-transparent'}`}
              >
                <Check size={11} strokeWidth={3} />
              </span>
              <span>{regra.rotulo}</span>
              <span className="sr-only">{ok ? '(ok)' : '(falta)'}</span>
            </li>
          )
        })}
      </ul>
      <p className={`text-xs mt-2.5 leading-relaxed ${auth ? 'text-slate-500' : 'text-muted-foreground'}`}>
        Evite senhas muito conhecidas, como <b>Senha@123</b> ou <b>Mudar@2026</b>: o sistema recusa as que já apareceram em vazamentos.
      </p>
    </div>
  )
}
