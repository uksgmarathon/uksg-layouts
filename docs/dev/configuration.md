# Configuration

## Bundle config: `cfg/uksg-layouts.json`

Lives in the NodeCG install's `cfg/` folder. Anything left out uses the default from `configschema.json`, so the file
only needs what you're changing.

| Key | Default | Notes |
| --- | --- | --- |
| `theme` | `"red"` | `red`, `green` or `blue`. Sets colours and logos on every graphic. |
| `tracker.enabled` | `false` | Fetch donation total, incentives and donations from the tracker. |
| `tracker.useTestData` | `false` | Generate fake data instead of contacting the tracker (for testing). |
| `tracker.url` | `https://tracker.example.com` | Tracker base URL, e.g. `https://tracker.uksgmarathon.com` (no trailing slash). |
| `tracker.eventShort` | `event_short` | The event's "short" on the tracker, e.g. `uksgblue26`. |
| `tracker.currencySymbol` | `£` | Used when formatting amounts. |
| `obs.enabled` | `false` | Connect to OBS (needed for capture positioning and audio automation). |
| `obs.url` / `obs.password` | `ws://localhost:4455` / `""` | obs-websocket connection. |
| `obs.names.scenes.gameLayout` | `Game Layout` | The OBS scene the game layout captures live in. |
| `obs.names.captures.games` | `["Game Capture 1", "Game Capture 2"]` | Game capture source names, in feed order (Game1, Game2). |
| `obs.names.captures.camera` | `Camera Capture` | Camera source name. |
| `foobar2000.enabled` | `false` | Connect to foobar2000 via the Beefweb plugin (now-playing on intermission, play/pause automation). |
| `foobar2000.url` | `http://localhost:8880/api` | Beefweb API URL. |
| `foobar2000.username` / `password` | `""` | Only if Beefweb authentication is on. |
| `xr18.enabled` | `false` | Connect to a Behringer XR18 over OSC for audio fades. |
| `xr18.ip` | `""` | Mixer IP address. |
| `xr18.fadeLength` | `1000` | Fade length in ms. |
| `xr18.faders.player` / `reader` / `game` | `/dca/1/fader`, `/dca/2/fader`, `/dca/3/fader` | OSC addresses of the faders to fade. |

Example for an event:

```json
{
  "theme": "blue",
  "tracker": {
    "enabled": true,
    "url": "https://tracker.uksgmarathon.com",
    "eventShort": "uksgblue26"
  },
  "obs": {
    "enabled": true,
    "password": "secret"
  }
}
```

The bundle's `pnpm start` script loads `cfg/.env.uksg` as environment variables if it exists
(`node --env-file-if-exists=cfg/.env.uksg index.js`).

## speedcontrol custom data

Some per-run settings can come from the schedule via speedcontrol's run **custom data**. To edit these fields in
speedcontrol's run editor (or fill them from a Horaro import), declare them in `cfg/nodecg-speedcontrol.json`:

```json
{
  "customData": {
    "run": [
      { "name": "Layout", "key": "layout" },
      { "name": "Tracker run ID", "key": "trackerRunId" },
      { "name": "Content warnings", "key": "contentWarnings" },
      { "name": "Badge colour(s)", "key": "badgeColour" },
      { "name": "Badge label(s)", "key": "badgeLabel" },
      { "name": "Feed colour(s)", "key": "feedColour" },
      { "name": "Accent colour", "key": "accentColour" }
    ]
  }
}
```

| Key | Example | What it does |
| --- | --- | --- |
| `layout` | `16x9-2p` | Game layout chosen automatically when the run becomes active. One of `4x3-1p`, `4x3-2p`, `16x9-1p`, `16x9-2p`, `3DS-1p` (case-insensitive). |
| `trackerRunId` | `276` | The run's ID on the tracker. Links incentives to this run when the game names differ between tracker and speedcontrol. Normally not needed; matching is by game name, then category. |
| `contentWarnings` | `Flashing Lights, Strong Language` | Default content warnings, matched by name against the warning list. Ignored once warnings have been ticked for the run on the dashboard. |
| `badgeColour` | `#e52521, #43b047` | Runner badge colour(s): a single value for every player, or a comma separated list in player order. Hex colours only (e.g. `#e52521`); anything else is ignored. |
| `badgeLabel` | `Mario, Luigi` | Runner badge text(s), instead of "RUNNER". Same single value / list rule. |
| `feedColour` | `#e52521, #43b047` | Game feed border colour(s). Same rule. |
| `accentColour` | `#7b3fb5` | Colour of the game badge (run info box). |

Player-level custom data with the same keys (`badgeColour`, `badgeLabel`, `feedColour`) is also honoured if your import fills it.
Anything set in the **Run Customisation** panel overrides all of these. Those overrides are stored against
speedcontrol's run/player IDs, so they're lost if the schedule is re-imported.

## OBS

### Browser sources

Add each graphic as a 1920×1080 browser source:

| Graphic | URL |
| --- | --- |
| Omnibar | `http://<nodecg-host>:<port>/bundles/uksg-layouts/graphics/omnibar/main.html` |
| Game layout | `…/graphics/game-layout/main.html` |
| Intermission | `…/graphics/intermission/main.html` |
| Countdown | `…/graphics/countdown/main.html` |

The game layout and intermission leave the bottom 80px for the omnibar, so put the omnibar source above them in each
scene that needs it.

### obs-websocket

The bundle uses obs-websocket v5. Audio automation relies on a custom obs-websocket build whose `SceneTransitionStarted`
event includes `fromScene`/`toScene`; it's in `obs-assets/obs-websocket.zip`. Install it over OBS's bundled
obs-websocket if you use audio automation.

### Capture positioning

When `obs.enabled` is on, the game layout graphic reports where its game and camera windows are. The extension moves,
resizes and shows/hides the configured capture sources in the `gameLayout` scene to match, and crops the camera to fit
its window's aspect ratio. This happens whenever the layout changes. Source and scene names must match
`obs.names` exactly. Sources for feeds that the current layout doesn't have are hidden.

### OBS scene names for audio

On a scene transition, parameters in square brackets at the end of the scene name control audio, e.g.
`Intermission [M,!P,!G]`. Only the differences between the old and new scene's parameters are acted on.

| Parameter | Meaning |
| --- | --- |
| `M` | Music should be playing (foobar2000 play; pause when leaving). |
| `!P` | Player/runner mics should be faded down (XR18 `faders.player`). |
| `!R` | Reader/host mics should be faded down (XR18 `faders.reader`). |
| `!G` | Game audio should be faded down (XR18 `faders.game`). |

## Companion / Stream Deck

The extension serves HTTP endpoints under `http://<nodecg-host>:<port>/uksg-layouts`. They accept GET or POST, so
Companion's generic HTTP module works.

| Endpoint | What it does |
| --- | --- |
| `/omnibar/force/incentive` | Pin the most relevant incentive (goal or bid war): the current run's, otherwise the soonest upcoming. Prefers incentives that haven't met their goal. |
| `/omnibar/force/goal` / `/omnibar/force/bid-war` | Same, but only goals / only bid wars. |
| `/omnibar/force/next-run` | Pin the next run. |
| `/omnibar/force/upcoming-runs` | Pin the "coming up" list. |
| `/omnibar/force/milestone` | Pin the next unreached milestone. |
| `/omnibar/force/donations` | Pin the donation list. |
| `/omnibar/force/donation` | Shout-out for the latest screened donation. |
| `/omnibar/force/message` | Pin the first enabled message. |
| `/omnibar/force/<type>?id=<id>` | Pin a specific item (bid ID, run ID, milestone ID, message ID, donation ID). |
| `/omnibar/release` | Release whatever's pinned. |
| `/omnibar/state` (GET) | JSON for button feedback: `{ "type", "id", "pinned", "pinRemainingSeconds" }`. |
| `/timer/toggle` (POST, JSON `{ "button_id": 1 }`) | Hardware timer buttons. Starts the timer if stopped or paused; if running for more than 10 seconds, stops it. In multi-team runs, button 1 stops team 1 and button 2 stops team 2. |

Force endpoints return `404 Nothing to show` if there's nothing of that type.

> These endpoints have no authentication (NodeCG's login doesn't cover them), so keep NodeCG on a private network.

## Dashboard-side settings

These are set from the dashboard and stored in NodeCG's database (replicants), not config files:

- **Omnibar Settings**: messages, milestones, rotation timings, pin auto-release (seconds), donation colour tiers.
- **Game Layout Control**: confetti and over-estimate mode. Both default to off and reset to off on every run change.
- **Run Customisation**: content warning list, per-run warnings, badge/feed/accent overrides.

See the [user guide](../user/README.md) for what each does.
