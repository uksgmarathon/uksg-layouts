# Troubleshooting (developers)

For problems seen on stream by hosts and producers, start with the [user troubleshooting guide](../user/troubleshooting.md).

## NodeCG won't start / the bundle doesn't load

### `Panel file "…/main.html" in bundle "uksg-layouts" does not exist`

The bundle hasn't been built. Run `pnpm build` (or use the prebuilt `build` branch).

### `TypeError: Cannot read properties of undefined (reading 'nodecg-speedcontrol')`

Thrown from `new SpeedcontrolUtil(...)`. You're on NodeCG **2.6.4**, whose server API exposes `extension` instead of
`extensions`. Use NodeCG **2.6.1**. Because livesplit-core (in speedcontrol) installs an `uncaughtException` handler,
this can show up as a huge minified stack trace ending in `abort({})`. Scroll up to find the real error.

### `better-sqlite3` fails to build or load

NodeCG 2.6.1 depends on `better-sqlite3` 11.x, which doesn't build on Node 23+. Add `"overrides": { "better-sqlite3":
"12.11.1" }` to the NodeCG root's `package.json` and reinstall. If npm 11 skipped its install script, run
`npm install-scripts approve better-sqlite3`.

### `Invalid value rejected for replicant "…"` at startup

A schema's default doesn't validate against the schema. Usually it's a nested object with `"default": {}` whose
properties are `required`: NodeCG doesn't fill in children's defaults. Give the full object as the default.

### `Error: uksg-layouts has an illegal file named "extension"`

The bundle folder contains symlinks for `extension/` etc. NodeCG requires real directories there. Use a real clone.

## Replicant defaults missing / schemas ignored

Symptoms: a new replicant's value is `undefined` (or an empty string in the database), graphics show nothing for it, and
invalid values aren't rejected.

Cause: NodeCG is installed **as a dependency** (its root `package.json` isn't named `nodecg`) **and** the bundle in
`bundles/` is a **symlink**. In that mode, NodeCG 2.6.1 finds a bundle's schema folder by listing `bundles/` and keeping
only `isDirectory()` entries, and a symlink doesn't count. Extensions and graphics still load, so it's easy to miss.

Fix: make `bundles/uksg-layouts` a real folder (clone it there, or `git worktree add`). Then delete any bad stored values
from `db/nodecg.sqlite3`, e.g.
`sqlite3 db/nodecg.sqlite3 "delete from replicant where namespace='uksg-layouts' and name='contentWarnings'"`, and
restart.

## Changes don't show up

| Symptom | Fix |
| --- | --- |
| Graphic or panel still shows old behaviour | Rebuild and **refresh the page**. Open pages keep their old code even after NodeCG restarts. |
| Extension change has no effect | Rebuild and **restart NodeCG**. |
| Schema change: dashboard writes silently do nothing | The running server still has the old schema, so writes in the new shape fail validation. Restart NodeCG. |
| After a schema change, a setting reset itself | Expected: a stored value that no longer validates is replaced by the defaults on startup. |

## Data problems

| Symptom | Cause / fix |
| --- | --- |
| No incentives or donations at all | `tracker.enabled` is off, or `tracker.url` / `tracker.eventShort` is wrong. Check the NodeCG log for `[Tracker] Error updating from API`. Test the URL yourself: `<url>/tracker/api/v2/events/?short=<eventShort>&totals=`. |
| An incentive is missing | Check it in the public API: `<url>/tracker/api/v2/events/<id>/bids/?tree`. If it isn't listed, it's hidden/pending/denied on the tracker. Only `OPENED` bids and `CLOSED` challenges that met their goal are used. |
| Incentive not linked to its run (`runId` is `null`) | The game names differ between tracker and speedcontrol. Set `customData.trackerRunId` on the speedcontrol run (declare the field in speedcontrol's config). |
| Donations missing | Only screened donations (read state not `PENDING`/`FLAGGED`) are used, and only the first page of the donations API. |
| Runner overrides lost | Run Customisation overrides are keyed by speedcontrol run/player IDs, which change when the schedule is re-imported. |

## Graphics behaviour

| Symptom | Cause / fix |
| --- | --- |
| Confetti never fires | `layoutSettings.celebrateFinish` is off (default, and reset on every run change). It only fires on the change to `finished`, not if the page loaded with the timer already finished. Background browser tabs throttle animations. |
| Over-estimate warning never shows | `layoutSettings.overEstimate` is `off` (default, reset on run change). It only shows while the timer is `running`/`paused` and at least a second over `estimateS`. |
| Race finish badges missing | Only in the 2p layouts, for runs with 2+ teams, once a team appears in `timer.teamFinishTimes`. |
| Omnibar item stuck | Check `curl <host>/uksg-layouts/omnibar/state`. If `pinned` is true, release it (`/omnibar/release`). With `pinTimeout` 0, pins never expire. |
| Text truncated with "…" in the omnibar | Shouldn't happen for incentive titles or game names; see the conventions in [Architecture](architecture.md#conventions). |

## Development gotchas

- **Dashboard panels opened directly show `globalThis.NodeCG is not a constructor`.** Panels read the NodeCG API from
  the parent dashboard frame. Open them inside `/dashboard/`.
- **`await nodecg.sendMessage(...)` hangs** in scripts and tests: the promise only resolves if the listener calls its
  acknowledgement. Fire and forget with `void`.
- **Top-level `await` in the extension:** NodeCG loads the extension entry with `require()`, so the entry
  (`src/extension/index.ts`) must not use top-level await. Modules it imports dynamically can, but each one delays
  every module after it, so don't wait on outside services (OBS, the tracker) at load time.
- **`vue/multi-word-component-names` lint error:** component names must be multi-word (e.g. `ConfettiBurst`, not `Confetti`).
- **Child component styles vs parent overrides:** when overriding a child component's module class from a parent, use a
  more specific selector (e.g. `.Estimate .OverChip`). The order the two stylesheets load in isn't guaranteed.
