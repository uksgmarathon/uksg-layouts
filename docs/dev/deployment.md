# Deployment

How to install and update the bundle on the machine that runs NodeCG for an event.

## Requirements

- **NodeCG 2.6.1.** Don't use 2.6.4: its extension API no longer exposes `nodecg.extensions`, which `speedcontrol-util`
  relies on, so this bundle's extension fails to load.
- **Node.js 22** (what CI builds with). Newer versions work, but with Node 23+ NodeCG 2.6.1 needs the `better-sqlite3`
  override described in the [quick-start](quick-start.md#1-create-a-scratch-nodecg).
- **nodecg-speedcontrol 2.x** (tested with 2.6.0, `build` branch).
- Network access from the NodeCG machine to the donation tracker, and to OBS / foobar2000 / the XR18 if those integrations
  are used.

## How builds are made

Built files are not committed to `main`. The **Build** GitHub Actions workflow (`.github/workflows/build.yml`) runs on
every push to `main`. It merges `main` into the `build` branch, runs `pnpm build` and commits the output (`extension/`,
`graphics/`, `dashboard/`, `shared/dist/`) to `build`.

It can also be run manually (*Actions → Build → Run workflow*) with a different base branch and target branch, e.g. to
build a feature branch into a separate test branch without touching `build`.

> **Pushing to `main` during an event updates `build` within a few minutes.** That's only a problem if someone then
> pulls on the production machine, but be deliberate about what gets merged mid-event.

## First install

On the NodeCG machine, from the NodeCG root (the folder with `bundles/` and `cfg/`):

```bash
# speedcontrol, if it isn't already installed
git clone -b build https://github.com/speedcontrol/nodecg-speedcontrol bundles/nodecg-speedcontrol
(cd bundles/nodecg-speedcontrol && npx --yes pnpm@10 install --prod --frozen-lockfile)

# this bundle: the prebuilt "build" branch, plus its runtime dependencies
git clone -b build https://github.com/uksgmarathon/uksg-layouts.git bundles/uksg-layouts
(cd bundles/uksg-layouts && npx --yes pnpm@10 install --prod --frozen-lockfile)
```

Don't use `nodecg install uksgmarathon/uksg-layouts`: it clones `main`, which has no built files.
Install the bundle as a real folder, not a symlink (see [Troubleshooting](troubleshooting.md#replicant-defaults-missing--schemas-ignored)).

Alternatively, clone `main` and build on the machine with `pnpm install && pnpm build`.

Then:

1. Create `cfg/uksg-layouts.json`: at least `theme` and the `tracker` settings (see [Configuration](configuration.md)).
2. Add the speedcontrol custom data fields to `cfg/nodecg-speedcontrol.json` if you want to set layouts, badge colours,
   warnings or tracker IDs from the schedule ([Configuration](configuration.md#speedcontrol-custom-data)).
3. If using audio automation, install the custom obs-websocket from `obs-assets/obs-websocket.zip`.
4. Start NodeCG (`node index.js` from the NodeCG root, or `pnpm start` from `bundles/uksg-layouts`).
5. Add the browser sources to OBS ([Configuration](configuration.md#obs)).

## Before each event

- [ ] `cfg/uksg-layouts.json`: correct `theme` and `tracker.eventShort`.
- [ ] Import the schedule into speedcontrol (Oengus/Horaro import panel). Re-importing loses Run Customisation overrides, so import before setting those up.
- [ ] **Omnibar Settings → Messages**: update the event name and donation link messages.
- [ ] **Omnibar Settings → Milestones**: enter the event's milestones.
- [ ] **Omnibar Settings → Rotation / Donation Colours**: check the timings and tiers.
- [ ] **Run Customisation**: check the content warning list; set up badge colours/labels and warnings for runs that need them.
- [ ] Upload rotation images (**Assets → Rotation Images**).
- [ ] Check every graphic in OBS, and refresh the browser sources after any update.
- [ ] Test Companion buttons and the hardware timer buttons, if used.
- [ ] Check incentives appear on the right runs (Host Control marks the current run's with **THIS RUN**). If a run's game
      name differs between tracker and speedcontrol, set `trackerRunId` in its custom data.

## Updating

```bash
cd bundles/uksg-layouts
git pull                                           # on the build branch
npx --yes pnpm@10 install --prod --frozen-lockfile # only needed if dependencies changed
```

Then **restart NodeCG** and **refresh every browser source** (and open dashboards). Graphics keep running their old code
until they're refreshed, even after a NodeCG restart.

To roll back, check out the previous commit on the `build` branch (`git log`, then `git checkout <commit>`) and restart.

### When schemas change

Replicant values are stored in NodeCG's database (`db/`). After an update:

- New replicants start with their schema defaults.
- A stored value that no longer matches its schema is discarded and replaced with the defaults. NodeCG logs this at
  "replicants" log level.
- Until NodeCG is restarted, the server keeps the old schema, and writes in the new shape are rejected. Always restart
  after updating.

### Upgrading from the version with the static omnibar

Things that are new or behave differently when updating from the version before the October 2026 omnibar/incentives update (where the omnibar's centre text was fixed):

- The omnibar's centre text was hard-coded. It now rotates, and the old "You are watching…" / "Donate @…" text is now
  editable messages in **Omnibar Settings → Messages**. The defaults are generic, so update them.
- New dashboard panels: **Run Customisation** (main workspace), **Host Control** (new **Host** workspace) and
  **Omnibar Settings** (UKSG workspace). **Game Layout Control** gains the confetti and over-estimate options.
- The tracker integration now also fetches incentives and donations. `tracker.enabled` must be on for those to appear.
- Defaults: forced items auto-release after 30 seconds. Confetti and the over-estimate warning are off and reset to off
  on every run change. The content warning list is Flashing Lights, Strong Language, Violence/Gore and Loud Noises.

## Security

- The Companion endpoints (`/uksg-layouts/omnibar/*`) and the hardware timer endpoint (`/uksg-layouts/timer/toggle`)
  are unauthenticated. NodeCG's login setting protects the dashboard but not bundle routes. Keep NodeCG on a private
  network.
- The bundle only uses the tracker's public API and never writes to it. No tracker credentials are needed.
