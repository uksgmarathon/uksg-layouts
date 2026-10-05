# Intermission, countdown & other panels

## Intermission

Shown between runs. It shows:

- **The event logo**
- **Rotating images** (see [Rotating images](#rotating-images))
- **The host**: from [Participant Control](#participant-control).
- **The music** that's playing, if tech has connected the music player (foobar2000). Shows "Not Playing" otherwise.
- **The next four runs**: "Coming up next" first, then "Later". Each card shows the game, runners, category, platform and
  estimate. If a run has incentives, a strip along the bottom of its card shows them, taking turns every 10 seconds if
  there's more than one. Incentives that have met their goal show **Met!**.

### Upcoming Run Control

In the **UKSG** tab. The "coming up next" run is set automatically: it moves on when the timer is stopped at the end
of a run. If it's ever wrong, use this panel to force it to the previous, current or next run, or to nothing.

## Countdown

The countdown graphic shows a large countdown to a set time, e.g. before the event starts.

**Countdown Control** (in the **UKSG** tab): pick the time to count down to on the clock and press **Apply**. The time
has to be later today. The panel shows how long is left.

## Participant Control

In the main workspace. Enter the **commentators** (up to two) and the **reader/host**, each with optional pronouns,
then press **Save**. **Clear** empties a row. These names appear in the name boxes on the game layouts (and the host on
intermission). Empty boxes are hidden on the graphics.

Runner names and pronouns come from the speedcontrol schedule, not this panel.

## Rotating images

The image boxes on the game layouts and intermission rotate through uploaded images, e.g. sponsor logos and charity
information, changing every 60 seconds.

To manage them, press **Assets** in the top right of the dashboard and choose **Rotation Images**. Upload or delete
images there (JPG, PNG, SVG, WebP or GIF). They're shown in order of file name, so name them `01-…`, `02-…` and so on to
control the order.

On the game layouts, the image box also takes turns showing the current run's incentives (see
[Runs & game layouts](runs-and-layouts.md#incentives-in-the-image-box)).

## Automatic audio and music (tech)

If tech has set it up, switching OBS scenes can automatically play or pause the music and fade the runner, host and game
audio on the mixer. This is driven by how the OBS scenes are named. See [Configuration](../dev/configuration.md#obs-scene-names-for-audio)
if you need to change it.
