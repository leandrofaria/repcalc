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
  <a href="https://github.com/leandrofaria/repcalc/actions/workflows/ci.yml"><img src="https://github.com/leandrofaria/repcalc/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/license-MIT-0F766E" alt="MIT">
</p>

<p align="center">
  <a href="README.md">English</a> •
  <strong>Português</strong>
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#como-rodar">Como rodar</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#testes">Testes</a> •
  <a href="#publicação">Publicação</a> •
  <a href="#contêiner">Contêiner</a> •
  <a href="#licença">Licença</a>
</p>

---

## Funcionalidades

**Jornada de trabalho** — a partir do horário de início, da duração da
jornada, do intervalo e da tolerância, mostra no topo o horário de saída e,
enquanto a jornada corre, quanto já foi trabalhado e quanto falta, ao vivo. O
excedente só é contado depois de ultrapassar a jornada mais a tolerância. Um
interruptor diz se o intervalo já foi tirado, o que muda a conta em tempo
real. Um segundo interruptor, _sair na tolerância_, faz o cartão liderar com a
tolerância: o horário de saída, o tempo que falta e a barra passam a contar até
a jornada menos a tolerância, que é como se sai no banco. Ele fica lembrado no
aparelho. Um turno que atravessa a meia-noite diz isso por extenso — "no dia
seguinte" — em vez de mostrar um `02:00` que parece estar no passado. As
definições ficam salvas no navegador.

**Calculadora** — soma, subtrai, multiplica e divide, misturando durações e
números puros. `2h 30min + 1h 45min` dá `4h 15m`; `7h 30min ÷ 2h 30min` dá `3`,
porque duração dividida por duração é um número sem unidade. As combinações
que não fazem sentido, como duração vezes duração, são recusadas em vez de
produzirem um resultado sem significado. As últimas contas ficam num
histórico, que dá para limpar.

**Tempo total** — soma o tempo decorrido entre até seis pares de marcações.
Marcações são cronológicas por construção, então um relógio que parece andar
para trás quer dizer que o dia virou: `22:00`–`23:00` seguido de
`00:00`–`00:30` é um turno noturno de uma hora e meia, e não uma sequência
fora de ordem. O dia em que cada par caiu aparece na tela, porque essa leitura
é uma interpretação e nada é assumido em silêncio. A única coisa recusada é um
par cujas duas marcações são idênticas — zero minutos ou exatamente vinte e
quatro horas, sem como saber qual.

### Colar as marcações do ponto

O relógio da empresa reporta o dia como uma linha — `08:00 09:00 09:10`, até
doze marcações. Tanto a Jornada quanto o Tempo Total aceitam essa linha colada
e se preenchem a partir dela.

A paridade da linha diz onde a pessoa está, e é isso que faz uma linha servir
às duas telas: contagem ímpar significa que a última marcação foi uma entrada
e ela ainda está no relógio; par significa que já saiu. Na Jornada, a primeira
marcação é a entrada e os intervalos entre as demais são a pausa já tirada. No
Tempo Total, cada duas marcações viram uma linha, e uma contagem ímpar deixa a
última linha pela metade em vez de recusar a colagem.

Nenhuma das telas recusa a paridade que não esperava, as duas dizem o que
entenderam antes de aplicar, e uma colagem vinda do lugar errado relata o que
não conseguiu ler em vez de produzir um dia mais curto em silêncio.

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
formulário — é o que faz ele caber na primeira dobra do celular.

A home diz o que o sistema faz e leva às três ferramentas. Ela é a única tela
sem navegação: sai-se dela pelos cartões, e volta-se a ela pelo nome do app no
cabeçalho. No telefone a navegação das demais telas fica na barra inferior, ao
alcance do polegar; do breakpoint `sm` para cima ela volta para o topo.

### Instalação como aplicativo

É um PWA: dá para instalar pelo navegador e usar **sem conexão**. Todas as
telas funcionam offline — que é o caso de uso real, em pé na frente do relógio
de ponto, num prédio sem sinal.

Abrir o app é o que verifica se há versão nova: o navegador refaz o pedido do
service worker a cada navegação. Havendo uma, ela é baixada em segundo plano e
a troca só acontece quando a pessoa aceita — trocar o código embaixo de um
cálculo meio digitado é como se perde o trabalho de alguém.

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
Sem conexão, o carregamento do gtag falha e nada mais acontece: o trecho
embutido define a função `gtag` sozinho, então os eventos apenas se acumulam
na fila e nenhum erro chega à pessoa.

> `NEXT_PUBLIC_*` é embutido no bundle **durante o build**, não lido em tempo
> de execução. Trocar o valor exige rebuildar.

### ⚠️ O build usa webpack de propósito

`npm run build` roda `next build --webpack`. O servidor de produção tem uma
glibc anterior à 2.29, então o binário nativo do SWC não carrega e o Next cai
para WASM — e o Turbopack, padrão do Next 16, exige esse binário. O Serwist
também injeta configuração de webpack, que o Next 16 recusa rodar sob
Turbopack. Não remova a flag; o CI reprova se ela sumir.

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
│   ├── punches/            Colagem da linha do relógio de ponto
│   ├── fields/             TimeField: o único lugar que fala com o picker
│   └── ui/                 Peças compartilhadas
└── lib/
    ├── time/               Duração e hora do dia, em minutos inteiros
    ├── calc/               Álgebra de unidades e máquina de estados
    ├── jornada/            Término previsto e painel em tempo real
    ├── tempoTotal/         Validação e soma dos pares
    ├── punches/            Leitura da linha de marcações
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

## Publicação

O CI roda a cada push na `main` e reproduz a mesma sequência que se roda antes
de publicar:

```bash
npm ci && npx prettier --check . && npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

O deploy em si é manual. Detalhes da convenção de branch e das armadilhas do
servidor estão em [CONTRIBUTING.md](CONTRIBUTING.md).

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
[Serwist](https://serwist.pages.dev/)

## Licença

MIT. Veja [LICENSE](LICENSE).

---

> [LeandroFaria.com](https://www.leandrofaria.com) &nbsp;&middot;&nbsp;
> GitHub [@leandrofaria](https://github.com/leandrofaria) &nbsp;&middot;&nbsp;
> LinkedIn [@farialaf](https://www.linkedin.com/in/farialaf)
