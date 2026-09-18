function IconeWhatsApp({ tamanho = 18 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5c0-5.19 4.23-9.41 9.42-9.41a9.36 9.36 0 0 1 9.41 9.42c0 5.19-4.23 9.4-9.42 9.4m8.02-17.43A11.26 11.26 0 0 0 12.05.75C5.8.75.71 5.84.71 12.09c0 2 .52 3.95 1.52 5.66L.62 23.63l6.02-1.58a11.3 11.3 0 0 0 5.41 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.33-8.02" />
    </svg>
  )
}

export function montarLinkWhatsApp(numero: string, mensagem?: string) {
  const soDigitos = numero.replace(/\D/g, '')
  return `https://wa.me/${soDigitos}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ''}`
}

const VARIANTES = {
  solido: 'gap-2 rounded-full bg-[#128C4B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0F7A41]',
  contorno: 'gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-[#128C4B] hover:text-[#128C4B]',
  flutuante: 'fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105',
} as const

// Link pro WhatsApp com a mensagem já escrita. "flutuante" é o botão redondo
// fixo no canto da tela (sites); "contorno" encaixa em menus e barras.
export function WhatsAppButton({ numero, mensagem, label = 'Falar no WhatsApp', variante = 'solido', className = '' }: {
  numero: string
  mensagem?: string
  label?: string
  variante?: keyof typeof VARIANTES
  className?: string
}) {
  const flutuante = variante === 'flutuante'
  return (
    <a
      href={montarLinkWhatsApp(numero, mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      title={flutuante ? label : undefined}
      aria-label={label}
      className={`inline-flex items-center justify-center transition-all ${VARIANTES[variante]} ${className}`}
    >
      <IconeWhatsApp tamanho={flutuante ? 28 : 18} />
      {!flutuante && <span>{label}</span>}
    </a>
  )
}
