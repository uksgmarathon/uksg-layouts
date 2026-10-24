# Developer guide

For anyone installing, configuring, deploying or changing the bundle. If you're running the stream on the day, the
[user guide](../user/README.md) is probably what you want.

- [Quick-start](quick-start.md): get a scratch NodeCG running with this bundle, test data, building, checks and testing tips.
- [Architecture](architecture.md): how the code is organised, replicants, messages, HTTP routes and code conventions.
- [Configuration](configuration.md): the bundle config file, speedcontrol custom data, OBS scene names, Companion/Stream Deck.
- [Deployment](deployment.md): installing and updating for an event.
- [Troubleshooting](troubleshooting.md): setup, build and runtime problems.

## At a glance

- **Stack:** NodeCG 2 bundle. The extension is TypeScript compiled with `tsc` (ESM). Graphics and dashboard panels are
  Vue 3 + TypeScript built with Vite (`vite-plugin-nodecg`); dashboard panels use Quasar; animations use GSAP.
- **Depends on:** [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol) (runs, timer) and the
  UKSG donation tracker (a GDQ-style django tracker, public v2 API).
- **Optional integrations:** OBS (obs-websocket; positions captures, drives audio automation), foobar2000 (Beefweb;
  music), Behringer XR18 (OSC; mic/game fades), Bitfocus Companion (HTTP endpoints).
- **Package manager:** pnpm 10 (`npx --yes pnpm@10 …` works if pnpm isn't installed).
- **NodeCG version:** 2.6.1. **Not 2.6.4**, which breaks `speedcontrol-util` (see [Troubleshooting](troubleshooting.md)).

## Common commands

Run from the repo root.

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies. |
| `pnpm build` | Clean and build everything (graphics, dashboard, extension) into `graphics/`, `dashboard/`, `shared/dist/`, `extension/`. |
| `pnpm watch` | Vite dev mode for graphics/dashboard plus `tsc --watch` for the extension. |
| `pnpm lint` / `pnpm autofix` | ESLint (and auto-fix). |
| `npx vue-tsc --noEmit -p tsconfig.browser.json` | Type-check graphics/dashboard. |
| `npx tsc -p tsconfig.extension.json --noEmit` | Type-check the extension. |
| `pnpm schema-types` | Regenerate `src/types/schemas/*.d.ts` after changing anything in `schemas/` or `configschema.json`. |
| `pnpm start` | Start NodeCG, when this bundle lives at `<nodecg>/bundles/uksg-layouts` (it runs `cd ../.. && node index.js`). |
