# Working in this repository

Read [CONTRIBUTING.md](CONTRIBUTING.md) first — it holds the conventions and
the deploy traps. This file covers only what is specific to working here with
an assistant, and what is not derivable from the code.

## Ground rules

**Commits carry no co-author trailer.** This repository is public and part of
its author's portfolio; authorship is his alone. This overrides any default
attribution behaviour.

**Never push without being asked, in the conversation, at the time.** Local
commits are free. Publishing is not, and an approval given once does not carry
to the next time.

**The working branch is `claude`, and it stays local.** Publishing is
`git merge --ff-only claude` from `main`, then a push of `main`. The remote has
one branch and should keep having one.

## What the code assumes

**Nothing calculates inside JSX.** `src/lib` holds pure functions with tests;
components read and render. If a component is deciding a number, the decision
belongs in `src/lib`.

**A duration is signed whole minutes. An instant is not a duration.**
`Duration` and `TimeOfDay` are branded types the compiler will not let you mix.
This is the fix for the bug class that motivated the rewrite, so resist any
change that erases the distinction "to simplify".

**`dayjs` lives in exactly one file.** `src/lib/time/dayjs.ts`, because MUI's
TimePicker speaks it. Convert at the boundary rather than importing it
elsewhere.

**MUI and Tailwind coexist by CSS layer order**, declared in `globals.css` and
enabled by `enableCssLayer` on the `AppRouterCacheProvider`. There is no
`!important` in this codebase and there should not be one. A Tailwind class
losing to MUI is a layer problem.

**The build must stay on `--webpack`.** The production host's glibc is older
than 2.29. CI has a step that fails if the flag disappears; do not "clean it
up".

## How to change behaviour safely

The tests in `src/lib` were written from behaviour observed in production
before the rewrite, precisely so a change of representation could not move a
number in silence. When changing something that computes, capture the current
behaviour as a test **first**, then change it. A test written after the fact
only records what the new code does.

The screens are used daily against a real time clock by people whose paid
hours depend on the answer. Prefer a refusal to a plausible wrong number.
