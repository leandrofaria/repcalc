# Contributing

This is a small app with one maintainer, so most of what follows is a note to
my future self. It is written down because every item here has cost me an
afternoon at least once.

## Getting set up

```bash
npm ci
npm run dev
```

Node 22 or newer — the version lives in `.nvmrc`, and CI reads it from there,
so that file is the single place it is declared.

## The one command that has to pass

Before committing anything, run exactly what CI runs, in the same order:

```bash
npm ci && npx prettier --check . && npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

There is deliberately no `pre-push` hook. The check is a command you run, not
something that happens to you.

Coverage is a real gate, not a report: `vitest.config.ts` requires 90% of lines
and functions and 85% of branches, and it asks that of `src/lib` only. Ninety
percent of a library of pure functions means something; a global threshold that
counts JSX does not.

## Branches

The working branch is `claude`, and it is **local**. It never reaches the
remote, so `origin` has exactly one branch: `main`.

Publishing is a fast-forward:

```bash
git switch main
git merge --ff-only claude
git push
git switch claude
```

The push to `main` is what triggers CI. Because there are no pull requests,
**CI reports after the fact rather than blocking before it** — when it goes
red, `main` is already broken and the fix goes forward. That is acceptable
here because the deploy is manual and separate, but it is worth knowing the
difference between a gate and a safety net.

## Writing code

**No business logic inside JSX.** Everything that calculates lives in
`src/lib`, is a pure function, and has a test. A component reads state and
renders it; if you find yourself writing a conditional that decides a number,
it belongs one directory over.

**Durations are whole signed minutes, and instants are not durations.**
`Duration` and `TimeOfDay` are branded types that the compiler refuses to mix.
The previous version used `Dayjs` for both, and that single confusion produced
totals that wrapped past 24h, a `-1h -30m`, and a page that had to reload
itself at midnight.

**`dayjs` is confined to `src/lib/time/dayjs.ts`.** MUI's TimePicker speaks
Dayjs and nothing else does. If you need it somewhere new, convert at the
boundary instead of widening the import.

**Colours come from `src/lib/design/tokens.ts`.** MUI reads the values, and
Tailwind reads the custom properties generated from them. A test fails if the
two drift.

**No `!important`.** MUI and Tailwind coexist through the CSS layer order
declared in `globals.css`, together with `enableCssLayer` on the
`AppRouterCacheProvider`. If a Tailwind class is losing to MUI, the layer
setup is what to look at, not the specificity of your selector.

## Commits

Messages are in English, and they say **why**, not what — the diff already
says what. A subject line in the imperative, then prose. No trailers.

## The build must stay on webpack

`npm run build` is `next build --webpack`, and the flag is load-bearing twice
over: the production host runs a glibc older than 2.29, so `@next/swc`'s native
binary will not load there and Turbopack — the Next 16 default — cannot run
without it; and Serwist injects a webpack config that Next 16 refuses to run
under Turbopack at all.

CI has a step that reads the flag out of `package.json` and fails if it is
gone. That step exists because CI cannot catch this any other way: a GitHub
runner has a modern glibc, so dropping the flag would leave CI green and break
only the deploy.

## Deploying

Manual, on purpose. The frequency is low — the app went untouched from 2023 to
2026 — and the steps below reward having someone watching:

- **A failed build destroys `.next`.** Next removes the previous output before
  writing the new one, so a build that dies halfway leaves nothing to serve.
- **Rebuilding in place gives 404s on chunks.** Clients holding the old HTML
  ask for filenames whose hashes no longer exist.
- **`npm ci` deletes `node_modules`** — including out from under the process
  currently running.
- **`pm2 start` cannot recreate the process.** The saved command is the only
  record of which port this app listens on; restart the existing entry rather
  than deleting and recreating it.

The GitHub side never touches the server. There is no deploy key, no secret,
and no port opened for CI. That is a deliberate trade: the same host also runs
an app with paying users, and putting a key to it in a public repository's
secrets would be a new attack surface solving a problem this project does not
have.

### Service worker revisions

Precached routes carry a revision that is part of their cache key, so an
unchanged revision means an installed app never asks for that file again. The
revision is derived from the current commit in `next.config.ts` — deliberately,
because it used to be the package version, and publishing without bumping that
version left installed apps on stale HTML pointing at chunks the new deploy no
longer had.

Nothing to remember when deploying, which is the point. But if you change how
that value is computed, make sure it still changes whenever the build's output
does.
