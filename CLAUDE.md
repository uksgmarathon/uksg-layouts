# CLAUDE.md

NodeCG 2 bundle with the on-screen graphics and dashboard for UKSG speedrunning marathons. It works with
nodecg-speedcontrol (runs and timer) and the UKSG donation tracker (GDQ-style, public v2 API).

Full docs are in `docs/`: user guide in `docs/user/`, developer guide in `docs/dev/` (start with
`docs/dev/architecture.md`). **When you change a feature, update the matching user and dev docs in the same change.**

## Commands

```bash
pnpm install                                     # or: npx --yes pnpm@10 install
pnpm build                                       # graphics/dashboard (Vite) + extension (tsc)
pnpm lint
pnpm test                                        # node:test, no build needed (test/*.test.ts)
npx vue-tsc --noEmit -p tsconfig.browser.json    # type-check graphics/dashboard
npx tsc -p tsconfig.extension.json --noEmit      # type-check extension
pnpm schema-types                                # after editing schemas/*.json or configschema.json
```

Run lint, the tests, both type-checks and a build before calling something done.

## Layout

- `src/extension/`: server (ESM, imports need `.js`). `index.ts` imports modules in order. Key modules:
  - `tracker.ts`: polling and test data
  - `omnibar.ts`: rotation engine, pins, Companion HTTP routes, celebrations
  - `image-rotation.ts`
  - `game-layout.ts`: OBS positioning, auto layout, per-run settings reset
- `src/graphics/<name>/` and `src/dashboard/<name>/`: Vue 3 SFCs (`main.ts` + `main.vue`). Shared pieces live in
  `src/graphics/_misc/` and `src/dashboard/_misc/`. A new graphic or panel also needs an entry in `package.json`'s `nodecg` section.
- `src/browser_shared/`: replicants (`useReplicant`) and composables shared by graphics and dashboard.
- `schemas/`: one JSON schema per replicant. Declare each new replicant in **both**
  `src/extension/util/replicants.ts` and `src/browser_shared/replicants.ts`, and re-export its type in `src/types/schemas.d.ts`.

## Rules the user has asked for (don't regress these)

- **Incentive titles, bid war option names and omnibar game names are never truncated with "…".** Stack the bar
  underneath (`useStacked`) or scroll (`useMarquee`) instead.
- **Standalone bars and chips use the double-cut shape** (top-right and bottom-left corners cut) via `@include doubleCut()`
  in `src/graphics/_misc/_cut.scss`. Borders on clipped shapes use `doubleCutBorder()`, never an inset box-shadow.
- **Progress bars show true percentages:** goals and milestones go from £0 to the target; bid war bars show each option's share of the total.
- **Content warnings appear only in the game badge** (RunInfo), not in the omnibar or on intermission.
- **Donation incentives always show the game name** along with the incentive.
- **Met incentives** (challenges at or over their goal, which the tracker closes) can be forced and show on intermission
  cards, but are never in a rotation (omnibar or game-layout image box).
- **Donation shout-outs are only ever shown by a host**, never automatically. Donations only appear once screened.
- **Confetti and over-estimate (`layoutSettings`) default to off** and reset to off on every run change.
- **Race finish times** pop up over each runner's game feed (2p layouts): time only, no 1st/2nd labels, fastest is gold.
- Forced omnibar items auto-release after `pinTimeout` **seconds** (default 30).

## Gotchas

- **Use NodeCG 2.6.1, not 2.6.4.** 2.6.4 breaks `speedcontrol-util` (`nodecg.extensions` is undefined).
- **Don't symlink the bundle into a dependency-mode NodeCG's `bundles/`.** 2.6.1 then skips schemas (no defaults, no
  validation). Clone into `bundles/` or use a git worktree.
- **Extension or schema changes need a NodeCG restart. Graphics and panels need a page refresh.** Open pages keep old code.
- **Nested object schema properties need a full `default`**, not `{}`, or startup fails with "Invalid value rejected".
- **Don't `await nodecg.sendMessage()` in tests**, because it never resolves without an ack.
- **The public tracker API exposes unscreened donor names**, so keep the `readstate` filter in `tracker.ts`.
- **Dashboard panels only work inside `/dashboard/`**, because they use `window.top.NodeCG`.
- **Pushing to `main` triggers CI**, which rebuilds the `build` branch that production machines pull from. Commit or
  push only when the user asks; work on a feature branch.

## Testing

See `docs/dev/quick-start.md` for setting up a scratch NodeCG (port 9090) with speedcontrol, plus testing tips:
- `tracker.useTestData` for fake incentives and donations
- curl on `/uksg-layouts/omnibar/force/...` to force omnibar items
- driving speedcontrol from a graphic page console with `nodecg.sendMessageToBundle('timerStart', 'nodecg-speedcontrol')`
- headless screenshots at 1920×1080 with puppeteer-core

If the user is testing on a shared instance at the same time, don't force or release omnibar items, run the timer or
change replicants there. Use a separate copy on another port.
