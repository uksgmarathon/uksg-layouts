# Developer quick-start

Get a scratch NodeCG running with this bundle so you can develop and test without touching a production machine.
The steps below were tested on macOS with Node 26 and npm 11. Node 22 (what CI uses) also works.

## Prerequisites

- **Node.js 22 or newer**
- **pnpm 10**: install it, or prefix commands with `npx --yes pnpm@10` instead of `pnpm`.
- **git**
- Optional: Google Chrome, for headless screenshots (see [Testing tips](#testing-tips)).

## 1. Create a scratch NodeCG

NodeCG is installed as an npm dependency in its own folder, with bundles in `bundles/` and config in `cfg/`.

```bash
mkdir -p ~/nodecg-scratch && cd ~/nodecg-scratch
npm init -y
# NodeCG 2.6.1's better-sqlite3 (11.x) doesn't build on Node 23+; 12.x works fine with it.
npm pkg set overrides.better-sqlite3=12.11.1
# Use exactly 2.6.1: 2.6.4 breaks speedcontrol-util (see troubleshooting).
npm install nodecg@2.6.1
echo "require('./node_modules/nodecg/index.js');" > index.js
mkdir -p bundles cfg
```

npm 11 may warn that `better-sqlite3` has install scripts "not covered by allowScripts". That's harmless as long as
NodeCG starts. If it fails to load `better_sqlite3.node`, run `npm install-scripts approve better-sqlite3` and reinstall.

## 2. Add nodecg-speedcontrol

```bash
git clone --depth 1 -b build https://github.com/speedcontrol/nodecg-speedcontrol bundles/nodecg-speedcontrol
(cd bundles/nodecg-speedcontrol && npx --yes pnpm@10 install --prod --frozen-lockfile)
```

## 3. Add this bundle

Clone the repo **into** `bundles/` so it's a real folder:

```bash
git clone git@github.com:uksgmarathon/uksg-layouts.git bundles/uksg-layouts
cd bundles/uksg-layouts
pnpm install
pnpm build
```

> **Don't symlink the bundle into `bundles/`.** With NodeCG installed as a dependency (as above), NodeCG 2.6.1 skips
> symlinked bundle folders when it looks for replicant schemas. Everything appears to work, but new replicants start out
> empty and schema validation is silently skipped. If you need your working copy elsewhere, use `git worktree add` to put a
> worktree inside `bundles/`. More detail in [Troubleshooting](troubleshooting.md#replicant-defaults-missing--schemas-ignored).

## 4. Configure

`~/nodecg-scratch/cfg/nodecg.json`:

```json
{
  "host": "localhost",
  "port": 9090,
  "login": { "enabled": false }
}
```

`~/nodecg-scratch/cfg/uksg-layouts.json`: any settings you leave out use their defaults (see [Configuration](configuration.md)).
To try everything offline with fake incentives and donations:

```json
{
  "theme": "blue",
  "tracker": {
    "enabled": true,
    "useTestData": true
  }
}
```

To use real data from the UKSG tracker instead (read-only, public API):

```json
{
  "theme": "blue",
  "tracker": {
    "enabled": true,
    "url": "https://tracker.uksgmarathon.com",
    "eventShort": "uksgblue26"
  }
}
```

Leave OBS, foobar2000 and XR18 disabled (the default) unless you have them to hand.

## 5. Run it

```bash
cd ~/nodecg-scratch && node index.js
# or, from inside bundles/uksg-layouts:
pnpm start
```

- Dashboard: <http://localhost:9090/dashboard/>
- Graphics: <http://localhost:9090/bundles/uksg-layouts/graphics/omnibar/main.html> (likewise `game-layout`,
  `intermission`, `countdown`). Use a 1920×1080 window.
- Force a specific game layout in a graphic: `…/graphics/game-layout/main.html?override=16x9-2p` (codes: `4x3-1p`,
  `4x3-2p`, `16x9-1p`, `16x9-2p`, `3DS-1p`). A layout opened like this doesn't report capture positions to OBS.

## 6. Get some runs

speedcontrol starts empty. Use its **Oengus Schedule Import** (or Horaro import) panel on the dashboard to import the
event's schedule, then pick a run in **Run Player**. With real tracker data, incentives are linked to runs by game
name, so importing the same event's schedule makes those links work.

## Development loop

| You changed… | Do this |
| --- | --- |
| Graphics or dashboard (`src/graphics`, `src/dashboard`, `src/browser_shared`) | `pnpm build` (or keep `pnpm watch` running), then refresh the page. |
| The extension (`src/extension`) | `pnpm build` (or `pnpm watch`), then **restart NodeCG**. |
| A schema (`schemas/*.json`) | `pnpm schema-types`, rebuild, **restart NodeCG**. Schemas are read when a replicant is first declared, so an already-running NodeCG keeps the old one. |
| `configschema.json` | `pnpm schema-types`, rebuild, restart NodeCG. |

Before committing, run all of these:

```bash
pnpm lint
pnpm test
npx vue-tsc --noEmit -p tsconfig.browser.json
npx tsc -p tsconfig.extension.json --noEmit
pnpm build
```

## Testing tips

**Test data.** With `tracker.useTestData` on, the extension generates four incentives every 15 seconds: two goals (one
with a long name), a two-option bid war and a four-option bid war. Donor names are made up. Totals creep up and new donations arrive (with comments and
incentive links). They're attached to the current and next runs, so the game layout, intermission and Host Control all
have something to show.

**Force omnibar items from the command line** (the same endpoints Companion uses; see [Configuration](configuration.md#companion--stream-deck)):

```bash
curl localhost:9090/uksg-layouts/omnibar/force/bid-war?id=3
curl localhost:9090/uksg-layouts/omnibar/state
curl localhost:9090/uksg-layouts/omnibar/release
```

**Drive replicants and speedcontrol from a browser console.** Open any graphic page and use its `nodecg` object:

```js
// Change a replicant
const s = nodecg.Replicant('omnibarSettings'); await NodeCG.waitForReplicants(s); s.value.itemDuration = 3;
// Run the timer (useful for confetti, race finish times, over-estimate)
void nodecg.sendMessageToBundle('timerStart', 'nodecg-speedcontrol');
void nodecg.sendMessageToBundle('timerStop', 'nodecg-speedcontrol', { id: teamId, forfeit: false });
void nodecg.sendMessageToBundle('timerReset', 'nodecg-speedcontrol');
void nodecg.sendMessageToBundle('changeActiveRun', 'nodecg-speedcontrol', runId);
```

`sendMessage` and `sendMessageToBundle` return promises that only resolve if the listener acknowledges, so don't
`await` them unless you know it does.

To see the over-estimate warning quickly, give the active run a tiny estimate:
`run.value.estimateS = 2; run.value.estimate = '00:00:02'` (on `nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol')`).

**Headless screenshots.** `puppeteer-core` pointed at your installed Chrome is handy for checking graphics at exactly
1920×1080 (`page.setViewport({ width: 1920, height: 1080 })`). Dashboard panels can't be opened on their own: they read
the NodeCG API from the parent dashboard frame. Load `/dashboard/#workspace/<name>` and find the panel's frame with
`page.frames().find((f) => f.url().includes('<panel-name>'))`.

**Don't test on someone else's live instance.** Forcing and releasing omnibar items, running the timer or changing
replicants affects everyone looking at that NodeCG. Use your own scratch copy (copy the whole scratch folder with
`cp -Rc` and change the port to run a second one).
