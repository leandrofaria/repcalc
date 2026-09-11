<h1 align="center">
  <br>
  <img src="public/icons/icon-192.png" alt="REP Calc" width="72">
  <br>
  REP Calc
  <br>
</h1>

<h4 align="center">An hours calculator for people who punch an electronic time clock.</h4>

<p align="center">
  <a href="https://repcalc.leandrofaria.com"><strong>repcalc.leandrofaria.com</strong></a>
</p>

<p align="center">
  <a href="https://github.com/leandrofaria/repcalc/actions/workflows/ci.yml"><img src="https://github.com/leandrofaria/repcalc/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/license-MIT-0F766E" alt="MIT">
</p>

<p align="center">
  <strong>English</strong> •
  <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#running-it">Running it</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tests">Tests</a> •
  <a href="#publishing">Publishing</a> •
  <a href="#container">Container</a> •
  <a href="#license">License</a>
</p>

---

> The app itself is in Brazilian Portuguese: it is used daily at a Brazilian
> bank, against a clock whose labels are in Portuguese. The interface stays in
> the language of the people who use it; the code, the commits and this file
> are in English.

## Features

**Work shift** — from a start time, the length of the shift, the break and the
tolerance, it shows the clock-out time up top and, while the shift runs, how
much has been worked and how much is left, live. Overtime is only counted past
the shift plus the tolerance. A switch says whether the break has been taken
already, which changes the running figures. A second switch, _leave on the
tolerance_, makes the card lead with the tolerance instead: the clock-out time,
the countdown and the progress bar all measure against the journey minus the
tolerance, which is how people at the bank actually leave. It is remembered on
the device. A shift crossing midnight says so in words — "no dia seguinte" —
rather than showing an `02:00` that looks like it is in the past. Settings are
saved in the browser.

**Calculator** — adds, subtracts, multiplies and divides, mixing durations and
plain numbers. `2h 30min + 1h 45min` gives `4h 15m`; `7h 30min ÷ 2h 30min`
gives `3`, because a duration divided by a duration is a unitless number. The
combinations that mean nothing, such as a duration times a duration, are
refused rather than producing a meaningless result. Recent calculations are
kept in a history, which can be cleared.

**Total time** — sums the time elapsed across up to six pairs of punch marks.
Marks are chronological by construction, so a clock that appears to run
backwards means the day turned: `22:00`–`23:00` followed by `00:00`–`00:30` is
a night shift of an hour and a half, not a sequence out of order. The day each
pair landed on is shown, because that reading is an interpretation and nothing
is assumed silently. The one thing still refused is a pair whose two readings
are identical — zero minutes, or exactly twenty-four hours, with no way to
tell which.

### Pasting a line of punch marks

The company's time clock reports the day as a line — `08:00 09:00 09:10`, up
to twelve marks. Both the shift screen and the total-time screen take that
line pasted in and fill themselves from it.

The parity of the line says where the person is, and that is what makes one
line serve two screens: an odd count means the last mark was an entry and they
are still on the clock; an even count means they have clocked out. On the
shift screen the first mark is the clock-in and the gaps between the rest are
the break already taken. On the total-time screen each two marks make a row,
and an odd count leaves the last row half-filled rather than refusing the
paste.

Neither screen refuses the parity it did not expect, both say what they
understood before anything is applied, and a paste from the wrong place
reports what it could not read instead of quietly producing a shorter day.

### Keyboard shortcuts

On the calculator, the physical keyboard does everything the on-screen keypad
does:

| Key                    | Action                                     |
| ---------------------- | ------------------------------------------ |
| `0`–`9`                | Digits                                     |
| `h`                    | Marks the typed value as hours             |
| `m`                    | Marks the typed value as minutes           |
| `+` `-` `*` `/`        | Operators                                  |
| `Backspace`            | Deletes the last step typed                |
| `Enter` or `=`         | Calculates                                 |
| `c`, `Esc` or `Delete` | Clears the entry; again, clears the memory |

Combinations with Ctrl, Alt or Cmd are left to the browser.

### Layout

The answer comes before the fields. The three calculation screens respond as
you type, so the result is the subject of the screen rather than the end of a
form — which is what makes it fit above the fold on a phone.

The home says what the app does and leads to the three tools. It is the one
screen without navigation: you leave it through the cards, and you come back
to it through the app's name in the header. On a phone the other screens carry
their navigation in a bottom bar, within reach of the thumb; from the `sm`
breakpoint up it moves back to the top.

### Installing it as an app

It is a PWA: installable from the browser and usable **offline**. Every screen
works without a connection — which is the real use case, standing in front of
the time clock in a building with no signal.

Opening the app is what checks for a new version: the browser refetches the
service worker on every navigation. When there is one, it downloads in the
background and takes over only once the person accepts — swapping code under a
half-typed calculation is how someone loses their work.

---

## Running it

Requires [Node.js 22+](https://nodejs.org/) and npm.

```bash
git clone https://github.com/leandrofaria/repcalc
cd repcalc
npm ci
npm run dev
```

Available at http://localhost:3000. The default port is 3000.

### Scripts

| Command                 | What it does                 |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Development server           |
| `npm run build`         | Production build             |
| `npm start`             | Serves the production build  |
| `npm test`              | Unit and component tests     |
| `npm run test:watch`    | Tests in watch mode          |
| `npm run test:coverage` | Tests with a coverage report |
| `npm run lint`          | ESLint                       |
| `npm run typecheck`     | TypeScript with no emit      |
| `npm run format`        | Prettier                     |
| `npm run icons`         | Regenerates the PWA icons    |

### Environment variables

Copy `.env.example` to `.env.local`. None are required. Google Analytics stays
off without `NEXT_PUBLIC_GA_ID`, and off outside production too. With no
connection the gtag load fails and nothing else happens: the inline snippet
defines the `gtag` function itself, so events just queue up and no error ever
reaches the person.

> `NEXT_PUBLIC_*` is inlined into the bundle **at build time**, not read at
> runtime. Changing a value means rebuilding.

### ⚠️ The build uses webpack on purpose

`npm run build` runs `next build --webpack`. The production host has a glibc
older than 2.29, so the SWC native binary will not load and Next falls back to
WASM — and Turbopack, the Next 16 default, requires that binary. Serwist also
injects a webpack config, which Next 16 refuses to run under Turbopack. Do not
remove the flag; CI fails if it goes missing.

---

## Architecture

The rule is simple: **no business logic inside JSX**. Everything that
calculates lives in `src/lib`, is a pure function, and has a test.

```
src/
├── app/                    Routes (App Router), manifest and service worker
├── components/             Components, grouped by screen
│   ├── calculadora/        Display, keypad and keys
│   ├── jornada/            Live summary, form and settings
│   ├── tempoTotal/         Punch-mark rows
│   ├── punches/            Pasting the time clock's line
│   ├── fields/             TimeField: the only place that talks to the picker
│   └── ui/                 Shared pieces
└── lib/
    ├── time/               Duration and time of day, as whole minutes
    ├── calc/               Unit algebra and the state machine
    ├── jornada/            Predicted end and the live panel
    ├── tempoTotal/         Validating and summing the pairs
    ├── punches/            Reading the line of marks
    └── design/             Colour tokens
```

### Durations are whole minutes

The previous version used `Dayjs` — an **instant** — to represent a
**duration**. `dayjs().hour(5).minute(45)` means "today at 05:45", but was
used as "5h45". Several bugs came from that: totals above 24h wrapped around,
a negative subtraction printed `-1h -30m`, and the live panel had to reload
the page at midnight.

There are now two types, branded so the compiler refuses to mix them:

```ts
type Duration = number & { readonly __unit: "Duration" }; // signed minutes
type TimeOfDay = number & { readonly __unit: "TimeOfDay" }; // 0..1439
```

`dayjs` survives in a single file, `src/lib/time/dayjs.ts`, because MUI's
TimePicker speaks Dayjs. Picker values anchor to a fixed date, so the date on a
field carries no meaning and cannot go stale.

### One colour system, two schemes

`src/lib/design/tokens.ts` is the source of truth. MUI reads the values
directly; Tailwind reads them through the custom properties in
`src/app/tokens.css`. **A test fails if the two drift apart.**

MUI and Tailwind coexist through CSS layers, declared in `globals.css`:

```css
@layer theme, base, mui, components, utilities;
```

with `enableCssLayer` on the `AppRouterCacheProvider`. That, and only that, is
what makes every `!important` unnecessary.

---

## Tests

```bash
npm test
```

Two environments: `src/lib` runs in plain Node, the components in jsdom.
Coverage is required of `src/lib` only — 90% of a library of pure functions
means something; a global threshold counting JSX does not.

The `src/lib` cases were written from the behaviour **observed in production**
before the refactor, so that changing the representation could not change any
number silently.

---

## Publishing

CI runs on every push to `main` and reproduces the same sequence you run
before publishing:

```bash
npm ci && npx prettier --check . && npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

The deploy itself is manual. The branch convention and the server's traps are
in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Container

The production site does **not** run from this image — there the app is served
by `next start` under PM2. The `Dockerfile` exists for anyone who wants to host
their own copy:

```bash
docker build -t repcalc .
docker run -p 3000:3000 repcalc
```

Multi-stage, standalone output, Node 22 and an unprivileged user.

---

## Credits

[Next.js](https://nextjs.org/) · [React](https://react.dev/) ·
[TypeScript](https://www.typescriptlang.org/) ·
[MUI](https://mui.com/) · [Tailwind CSS](https://tailwindcss.com/) ·
[Day.js](https://day.js.org/) · [Vitest](https://vitest.dev/) ·
[Serwist](https://serwist.pages.dev/)

## License

MIT. See [LICENSE](LICENSE).

---

> [LeandroFaria.com](https://www.leandrofaria.com) &nbsp;&middot;&nbsp;
> GitHub [@leandrofaria](https://github.com/leandrofaria) &nbsp;&middot;&nbsp;
> LinkedIn [@farialaf](https://www.linkedin.com/in/farialaf)
