<h1 align="center">
  <br>
  <img src="public/icons/icon-192.png" alt="REP Calc" width="72">
  <br>
  REP Calc
  <br>
</h1>

<h4 align="center">Uma calculadora de horas para uso com relógio eletrônico de ponto.</h4>

<p align="center">
  <a href="https://repcalc.leandrofaria.com"><strong>repcalc.leandrofaria.com</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-0F766E" alt="MIT">
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#como-rodar">Como rodar</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#testes">Testes</a> •
  <a href="#contêiner">Contêiner</a> •
  <a href="#licença">Licença</a>
</p>

---

## Funcionalidades

**Calculadora** — soma, subtrai, multiplica e divide, misturando durações e
números puros. `2h 30min + 1h 45min` dá `4h 15m`; `7h 30min ÷ 2h 30min` dá `3`,
porque duração dividida por duração é um número sem unidade. As combinações
que não fazem sentido, como duração vezes duração, são recusadas em vez de
produzirem um resultado sem significado.

**Jornada de trabalho** — a tela que o app abre. A partir do horário de início,
da duração da jornada, do intervalo e da tolerância, mostra no topo o horário
de saída e, enquanto a jornada corre, quanto já foi trabalhado e quanto falta,
ao vivo. O excedente só é contado depois de ultrapassar a jornada mais a
tolerância. Um turno que atravessa a meia-noite mostra `02:00 (+1)`, e não um
`02:00` que parece estar no passado. As definições ficam salvas no navegador.

**Tempo total** — soma o tempo decorrido entre até seis pares de marcações,
recusando pares fora de ordem cronológica. Cada linha se exclui sozinha, e o
total é somado conforme os pares vão sendo preenchidos.

### Atalhos de teclado

Na calculadora, o teclado físico faz tudo o que o teclado da tela faz:

| Tecla                  | Ação                                      |
| ---------------------- | ----------------------------------------- |
| `0`–`9`                | Dígitos                                   |
| `h`                    | Marca o valor digitado como horas         |
| `m`                    | Marca o valor digitado como minutos       |
| `+` `-` `*` `/`        | Operadores                                |
| `Backspace`            | Apaga o último passo digitado             |
| `Enter` ou `=`         | Calcula                                   |
| `c`, `Esc` ou `Delete` | Limpa a entrada; de novo, limpa a memória |

Combinações com Ctrl, Alt ou Cmd são deixadas para o navegador.

### Layout

A resposta vem antes dos campos. As três telas de cálculo respondem enquanto
você digita, então o resultado é o assunto da tela e não o fim de um
formulário — é o que faz ele caber na primeira dobra do celular. No telefone a
navegação fica na barra inferior, ao alcance do polegar; do breakpoint `sm`
para cima ela volta para o topo.

### Instalação como aplicativo

É um PWA: dá para instalar pelo navegador e usar **sem conexão**. Todas as
telas funcionam offline — que é o caso de uso real, em pé na frente do
relógio de ponto, num prédio sem sinal.

---

## Como rodar

Requer [Node.js 22+](https://nodejs.org/) e npm.

```bash
git clone https://github.com/leandrofaria/repcalc
cd repcalc
npm ci
npm run dev
```

Disponível em http://localhost:3000. A porta padrão é a 3000.

### Scripts

| Comando                 | O que faz                         |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento       |
| `npm run build`         | Build de produção                 |
| `npm start`             | Serve a build de produção         |
| `npm test`              | Testes unitários e de componente  |
| `npm run test:watch`    | Testes em modo observador         |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run lint`          | ESLint                            |
| `npm run typecheck`     | TypeScript sem emitir             |
| `npm run format`        | Prettier                          |
| `npm run icons`         | Regera os ícones do PWA           |

### Variáveis de ambiente

Copie `.env.example` para `.env.local`. Nenhuma é obrigatória. O Google
Analytics fica desligado sem `NEXT_PUBLIC_GA_ID`, e também fora de produção.

> `NEXT_PUBLIC_*` é embutido no bundle **durante o build**, não lido em tempo
> de execução. Trocar o valor exige rebuildar.

### ⚠️ O build usa webpack de propósito

`npm run build` roda `next build --webpack`. O servidor de produção tem uma
glibc anterior à 2.29, então o binário nativo do SWC não carrega e o Next cai
para WASM — e o Turbopack, padrão do Next 16, exige esse binário. O Serwist
também injeta configuração de webpack, que o Next 16 recusa rodar sob
Turbopack. Não remova a flag.

---

## Arquitetura

A regra é simples: **nenhuma lógica de negócio dentro de JSX**. Tudo o que
calcula mora em `src/lib`, é função pura e tem teste.

```
src/
├── app/                    Rotas (App Router), manifest e service worker
├── components/             Componentes, agrupados por tela
│   ├── calculadora/        Display, teclado e teclas
│   ├── jornada/            Resumo ao vivo, formulário e definições
│   ├── tempoTotal/         Linhas de marcação
│   ├── fields/             TimeField: o único lugar que fala com o picker
│   └── ui/                 Peças compartilhadas
└── lib/
    ├── time/               Duração e hora do dia, em minutos inteiros
    ├── calc/               Álgebra de unidades e máquina de estados
    ├── jornada/            Término previsto e painel em tempo real
    ├── tempoTotal/         Validação e soma dos pares
    └── design/             Tokens de cor
```

### Durações são minutos inteiros

A versão anterior usava `Dayjs` — um **instante** — para representar
**duração**. `dayjs().hour(5).minute(45)` significa "hoje às 05:45", mas era
usado como "5h45". Daí vinham vários erros: totais acima de 24h davam a volta,
subtração negativa imprimia `-1h -30m`, e o painel em tempo real precisava
recarregar a página à meia-noite.

Hoje há dois tipos, marcados de forma que o compilador se recusa a misturar:

```ts
type Duration = number & { readonly __unit: "Duration" }; // minutos, com sinal
type TimeOfDay = number & { readonly __unit: "TimeOfDay" }; // 0..1439
```

`dayjs` sobrevive num arquivo só, `src/lib/time/dayjs.ts`, porque o TimePicker
do MUI fala Dayjs. Os valores do picker ancoram numa data fixa, então a data
de um campo não carrega significado e não envelhece.

### Um sistema de cor, dois esquemas

`src/lib/design/tokens.ts` é a fonte da verdade. O MUI lê os valores direto;
o Tailwind lê pelas custom properties de `src/app/tokens.css`. **Um teste
falha se os dois divergirem.**

MUI e Tailwind convivem por camadas CSS, declaradas em `globals.css`:

```css
@layer theme, base, mui, components, utilities;
```

com `enableCssLayer` no `AppRouterCacheProvider`. É isso, e só isso, que
dispensa qualquer `!important`.

---

## Testes

```bash
npm test
```

Dois ambientes: `src/lib` roda em Node puro, os componentes em jsdom. A
cobertura é exigida só de `src/lib` — 90% de uma biblioteca de funções puras
significa alguma coisa; um limite global contando JSX, não.

Os casos de `src/lib` foram escritos a partir do comportamento **observado em
produção** antes da refatoração, para que a mudança de representação não
alterasse nenhum número em silêncio.

---

## Contêiner

O site em produção **não** roda a partir desta imagem — lá o app é servido
por `next start` sob o PM2. O `Dockerfile` existe para quem quiser hospedar a
própria cópia:

```bash
docker build -t repcalc .
docker run -p 3000:3000 repcalc
```

Multi-stage, output standalone, Node 22 e usuário sem privilégios.

---

## Créditos

[Next.js](https://nextjs.org/) · [React](https://react.dev/) ·
[TypeScript](https://www.typescriptlang.org/) ·
[MUI](https://mui.com/) · [Tailwind CSS](https://tailwindcss.com/) ·
[Day.js](https://day.js.org/) · [Vitest](https://vitest.dev/) ·
[Serwist](https://serwist.pages.dev/) · ícones por [Icons8](https://icons8.com/)

## Licença

MIT. Veja [LICENSE](LICENSE).

---

> [LeandroFaria.com](https://www.leandrofaria.com) &nbsp;&middot;&nbsp;
> GitHub [@leandrofaria](https://github.com/leandrofaria) &nbsp;&middot;&nbsp;
> LinkedIn [@farialaf](https://www.linkedin.com/in/farialaf)
