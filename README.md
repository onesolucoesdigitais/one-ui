# One UI

Biblioteca central de componentes de UI da One Soluções Digitais, no formato de registry do shadcn.
Todo componente reaproveitável (de bibliotecas externas ou criado por nós) entra aqui e é instalado nos projetos a partir daqui.

## Instalar um componente em qualquer projeto

Requisitos do projeto: React/Next.js + Tailwind + shadcn configurado (`components.json`).

```bash
npx shadcn@latest add onesolucoesdigitais/one-ui/<nome-do-componente>
```

## Componentes

| Nome | O que é | Origem |
|---|---|---|
| fluid-orb | Orbe WebGL animado com efeito de fluido (props: tamanho e cor) | Rare UI |
| matrix-orb | Orbe de pontos com estados ocioso/ouvindo/pensando (ótimo pra assistente de IA) | Rare UI |
| gravity-letters | Letras, números ou componentes que caem e se empilham com gravidade | Rare UI |
| grid-reveal | Loading de imagem gerada por IA que vira a imagem real quando chega | Rare UI |
| scroll-progress | Pílula de progresso de leitura que abre menu das seções da página | Rare UI |
| animated-counter | Número que gira até o novo valor, estilo odômetro | Rare UI |
| gooey-nav | Barra de navegação com efeito gooey no item selecionado | Rare UI |
| bounce-sidebar | Menu vertical com indicador ativo em animação de mola | Rare UI |
| hook-sidebar | Menu vertical com trilho tracejado marcando o item ativo | Rare UI |
| proximity-sidebar | Sidebar de rolagem cujos itens crescem quando o mouse se aproxima | Rare UI |
| family-drawer | Drawer inferior com transições entre telas (Vaul) | Rare UI |
| folder-component | Pasta animada com cartões que abrem no hover/clique (props: cor, tamanho) | Rare UI |
| duration-picker | Seletor animado de duração em horas e minutos | Rare UI |
| otp-input | Campo de código OTP com caracteres animados | Rare UI |
| code-block | Bloco de código com tema gerado a partir de uma cor | Rare UI |
| github-activity | Mapa de calor de contribuições com ranking de repositórios | Rare UI |
| emoji-reaction | Botão de reação com emojis da Apple flutuando | Rare UI |
| notification-bell | Sino de notificação estilo iOS com contador | Rare UI |
| step-player | Trilha de etapas estilo iOS com play/pause | Rare UI |
| delete-button | Botão de excluir que pede confirmação no próprio botão, sem modal | Rare UI |
| date-range-picker | Seletor de período PT-BR com atalhos e modo mês, sem bug de fuso | BPO Fácil |
| th-redimensionavel | Cabeçalho de tabela com largura ajustável arrastando | BPO Fácil |
| filtro-avancado | Filtros combináveis estilo Notion + função `passaNosFiltros` | BPO Fácil |
| notificacoes-bell | Sino com contador e painel de avisos (usado no menu do BPO Fácil) | Aura |
| stat-card | Card de indicador com valor, detalhe e cor pelo significado (usado em Contas a Pagar/Receber do BPO Fácil) | Aura + Thimi |
| seletor-colunas | Mostrar/ocultar e reordenar colunas de tabela (drag) | BPO Fácil |

Prévias ao vivo dos componentes do Rare UI: https://rareui.com/components

## Adicionar um componente novo

1. Colocar o arquivo em `components/ui/<nome>.tsx` (imports internos via `@/lib/utils`).
2. Registrar em `registry.json` (nome, tipo, `dependencies` do npm, `registryDependencies`, `files`).
3. Adicionar na tabela acima e commitar.
4. Se vier de terceiros, manter a licença em `licenses/`.

## Licenças

Componentes de origem Rare UI: MIT, © Swami Malode — ver `licenses/rare-ui-LICENSE`.
