# Architecture

## Layout of the repo

```
configschema.json          Bundle config schema (cfg/uksg-layouts.json)
schemas/                   Replicant schemas (one JSON schema per replicant)
src/
  extension/               Server side (Node, ESM, compiled by tsc into extension/)
    index.ts               Entry point: sets the NodeCG context, then imports each module in order
    util/                  nodecg context, replicant declarations, speedcontrol, OBS, foobar2000, XR18, bid helpers
    tracker.ts             Polls the tracker: total, bids (incentives), donations; also the test-data generator
    omnibar.ts             Omnibar rotation engine, host pinning, Companion HTTP routes, total celebrations
    image-rotation.ts      Rotating images, plus the game layout's image/incentive alternation
    game-layout.ts         OBS capture positioning; auto layout + per-run settings reset on run change
    intermission.ts        Keeps "coming up next" (upcomingRunId) up to date
    countdown.ts           Countdown timer
    audio.ts               OBS scene-name parameters → foobar2000 play/pause and XR18 fades
    timer.ts               /timer/toggle HTTP route for hardware buttons
  browser_shared/          Shared by graphics and dashboard: replicants (useReplicant), formatting and composables
  graphics/                One folder per graphic (main.ts + main.vue); _misc/ holds shared components and CSS
  dashboard/               One folder per panel (main.ts + main.vue); _misc/ holds shared panel components
  types/                   Generated schema types (types/schemas/*.d.ts, via `pnpm schema-types`) and re-exports
obs-assets/                Custom obs-websocket build used for audio automation
docs/                      This documentation
```

Built output (`extension/`, `graphics/`, `dashboard/`, `shared/dist/`) is git-ignored on `main`. CI commits it to
the `build` branch (see [Deployment](deployment.md)).

Graphics and panels are picked up by `vite-plugin-nodecg` from `src/graphics/*/main.ts` and `src/dashboard/*/main.ts`.
A new one also needs an entry in `package.json` → `nodecg.graphics` / `nodecg.dashboardPanels`.

## Data flow

```
Tracker (public v2 API) ──poll 15s──▶ tracker.ts ──▶ donationTotal, trackerBids, trackerDonations
speedcontrol ─────────────────────▶ runDataArray, runDataActiveRun, runDataActiveRunSurrounding, timer
Dashboard panels ─────────────────▶ omnibarMessages, milestones, omnibarSettings, runCustomisation,
                                    contentWarnings, layoutSettings, participants, …
omnibar.ts (1s tick) ─────────────▶ omnibar (what's showing / pinned)
image-rotation.ts (1s tick) ──────▶ imageRotation, layoutRotation
Graphics ◀── read replicants (nodecg-vue-composable useReplicant) and render
```

The server owns anything time-based (rotation, pins, image cycling), so every open copy of a graphic shows the same
thing and survives a reload. Graphics are mostly pure functions of replicants.

## Replicants

All in the `uksg-layouts` namespace unless stated. Declared server-side in `src/extension/util/replicants.ts` and
browser-side in `src/browser_shared/replicants.ts` (keep both in sync).

| Replicant | Written by | Purpose |
| --- | --- | --- |
| `donationTotal` | tracker.ts | Event total. |
| `trackerBids` | tracker.ts | Open incentives, plus challenges that met their goal (even once closed). Sorted by tracker run order. Each has `runId` (matched speedcontrol run) and `options` for bid wars (sorted by total). |
| `trackerDonations` | tracker.ts | Latest 50 **screened** donations (read state not `PENDING`/`FLAGGED`). Comment only if `APPROVED`. Bids include game, name and option. |
| `omnibar` | omnibar.ts | `current` item `{ type, id }`, `startTimestamp`, and `pinned` (item + expiry) when a host forced something. |
| `omnibarSettings` | dashboard | Item duration, pin timeout (seconds), counts, celebration step, enabled types, donation colour tiers. |
| `omnibarMessages` | dashboard | Custom messages `{ id, text, enabled }`. |
| `milestones` | dashboard | `{ id, amount, name, description }`. |
| `runCustomisation` | dashboard | Overrides keyed by speedcontrol run ID: `accentColour` and per-player-ID `badgeColour`/`badgeLabel`/`feedColour`. |
| `contentWarnings` | dashboard | `available` warning list `{ id, text }` and `runs` (run ID → ticked warning IDs). |
| `layoutSettings` | dashboard; game-layout.ts resets | `celebrateFinish` (bool) and `overEstimate` (`off`/`diff`/`chip`). Both reset to off on run change. |
| `layoutRotation` | image-rotation.ts | Which current-run incentive (if any) the game layout's image box shows instead of an image. |
| `imageRotation` | image-rotation.ts | Current rotation image (asset checksum). |
| `assets:rotation-images` | NodeCG | Uploaded images (asset category "Rotation Images"). |
| `gameLayouts` | graphic + dashboard + game-layout.ts | Available layouts (reported by the graphic) and the selected one. |
| `capturePositions` | game layout graphic | Feed/camera positions for OBS. |
| `participants` | dashboard | Commentators and readers (name, pronouns). |
| `upcomingRunId` | intermission.ts / dashboard | Run shown as "coming up next" on intermission. |
| `countdown` | countdown.ts | Countdown state. |
| `foobar2000Data` | util/foobar2000.ts | Connection and now-playing. |
| speedcontrol `runDataArray`, `runDataActiveRun`, `runDataActiveRunSurrounding`, `timer` | speedcontrol | Read-only here (the dev tips use them for testing). |

## Messages and HTTP routes

| Message (`nodecg.sendMessage`) | Handled by | Data |
| --- | --- | --- |
| `omnibar_force` | omnibar.ts | `{ type, id }`. Pins an item (acks with an error if it doesn't exist). |
| `omnibar_release` | omnibar.ts | Releases the pin. |
| `omnibar_celebrate` | sent by omnibar.ts, handled by the omnibar LeftBox | `{ amount, name }`. |
| `intermission_forceUpcomingRun` | intermission.ts | Run ID (or nothing). |
| `countdownStart` | countdown.ts | `"HH:MM"`. |

HTTP routes are mounted under `/uksg-layouts` (`omnibar/force/:type`, `omnibar/release`, `omnibar/state`,
`timer/toggle`); see [Configuration](configuration.md#companion--stream-deck).

## Omnibar rotation (omnibar.ts)

- A 1 second tick. Without a pin, it advances when the current item's time is up or the item stops existing.
- Order: `upcomingRuns → goal → message → bidWar → donationList → milestone → message`. Each type cycles through its own
  IDs (`lastShown` per type). Types that are disabled in settings or have nothing to show are skipped.
- `goal` in rotation excludes met challenges. `milestone` shows only the next unreached milestone. `run`, `donation` and
  met goals are only ever shown when forced.
- Forcing sets `pinned` with `expiresTimestamp = now + pinTimeout * 1000` (0 = never expires). Releasing (manually, on
  expiry, or when the item disappears) resumes the rotation with a fresh timer.
- Celebrations fire on `donationTotal` increases that cross a milestone amount or a multiple of `celebrationStep`.

## Tracker integration (tracker.ts)

Uses the public v2 API: `/events/?short=…&totals=`, `/events/{id}/runs/` (every 5 minutes),
`/events/{id}/bids/?tree` and `/events/{id}/donations/` (first page, every 15 seconds).

- **Bids:** top-level `challenge`/`choice` bids that are `OPENED`, or `CLOSED` challenges with `total >= goal`.
  Options must be `OPENED` (this excludes unapproved user-suggested options). Hidden/pending/denied bids aren't in the
  public API at all.
- **Run matching:** speedcontrol run with `customData.trackerRunId` equal to the tracker run ID; otherwise normalised
  game name (tracker `name`/`display_name` vs speedcontrol `game`), using category to pick between duplicates.
- **Donations:** only `COMPLETED` donations whose `readstate` isn't `PENDING`/`FLAGGED`. The public API exposes donor
  names and amounts *before* screening, so this filter is essential.

## Conventions

- **Style:** match the surrounding code. Vue SFCs use `<script setup lang="ts">` and `<style lang="scss" module>` with
  `$style`. Global helpers in `src/graphics/_misc/common.css` (`.Flex`, `.FlexColumn`, `.Fixed`, `.Border*`) are imported
  in a CSS layer, so module classes always win over them.
- **Extension imports** need `.js` extensions (ESM, `verbatimModuleSyntax`). Server-side speedcontrol access goes
  through `sc` (`speedcontrol-util`).
- **Double-cut corners:** standalone bars and chips use the "double-cut" shape (top-right and bottom-left corners cut).
  Use `@include doubleCut($size)` and, for borders, `@include doubleCutBorder($size, $width, $colour)` from
  `src/graphics/_misc/_cut.scss`. Don't use an inset `box-shadow` as a border on a clipped shape, because the corners get cut off.
- **Never truncate incentive titles, option names or game names in the omnibar with "…".** Use `useStacked`
  (`browser_shared/stacked.ts`) to move the bar under the title when space is short, or `useMarquee`
  (`browser_shared/marquee.ts`) to scroll long text.
- **Content warnings** only appear in the game badge (RunInfo), not in the omnibar or on intermission.
- **Schema defaults:** a nested object property with `"default": {}` doesn't get its children's defaults; give the full
  object as the default. Run `pnpm schema-types` after any schema change.
- **Browser compatibility:** OBS browser sources are older Chromium, so avoid very new CSS (`color-mix()`, container
  queries). Hex/rgba colours are converted in JS (`hexToRgba`, `getTextColour` in `browser_shared/customisation.ts`).
- **Animations:** GSAP (including `Physics2DPlugin` for confetti) and CSS transitions. Use `useTweenedNumber` for
  counting numbers and growing bars.
