# User guide

This guide is for the people running the stream: hosts, producers and tech crew.
You don't need to know anything about the code.

## The graphics

There are four graphics, each a full 1920×1080 browser source in OBS:

| Graphic | What it is |
| --- | --- |
| **Omnibar** | The bar along the bottom of the screen. Shows the donation total, a rotating section in the middle (upcoming runs, incentives, donations, milestones, messages) and the clock. Sits on top of the other scenes. |
| **Game layout** | The main screen during a run: game and camera feeds, runner/host/commentator names, the game info "badge", the timer, and a box of rotating images/incentives. There are several layouts for different game shapes and player counts. |
| **Intermission** | Shown between runs: the next four runs (with any incentives for them), the host, the music that's playing and rotating images. |
| **Countdown** | A big countdown to a set time, used before the event starts. |

The colour theme (red, green or blue) matches the event and is set up in advance by tech.

## The dashboard

Everything is controlled from the NodeCG dashboard in a web browser.
Panels are grouped into tabs ("workspaces") along the top:

| Tab | Panel | Used for | Guide |
| --- | --- | --- | --- |
| Main workspace | Run Player, Timer, etc. | The speedcontrol panels: picking the current run and running the timer. | (speedcontrol) |
| Main workspace | **Participant Control** | Commentator and host names/pronouns. | [Intermission & more](intermission-and-more.md#participant-control) |
| Main workspace | **Game Layout Control** | Which game layout is used, plus confetti and the over-estimate warning for this run. | [Runs & game layouts](runs-and-layouts.md#game-layout-control) |
| Main workspace | **Run Customisation** | Content warnings and runner badge colours/labels for a run. | [Runs & game layouts](runs-and-layouts.md#run-customisation) |
| Host | **Host Control** | Showing things on the omnibar on demand. | [Host guide](hosts.md) |
| UKSG | **Omnibar Settings** | Messages, milestones, rotation timings and donation colours. | [Omnibar](omnibar.md) |
| UKSG | **Upcoming Run Control** | Correcting which run shows as "coming up next" on intermission. | [Intermission & more](intermission-and-more.md#upcoming-run-control) |
| UKSG | **Countdown Control** | Setting the time the countdown counts down to. | [Intermission & more](intermission-and-more.md#countdown) |

Images for the rotating image boxes are uploaded from the **Assets** button in the top right of the dashboard
(see [Rotating images](intermission-and-more.md#rotating-images)).

## Guides

- [Host guide](hosts.md): showing incentives, runs, donations and more on the omnibar when you talk about them.
- [Omnibar](omnibar.md): what rotates on the omnibar and how to change it.
- [Runs & game layouts](runs-and-layouts.md): layouts, runner badges, content warnings, race times, confetti and the over-estimate warning.
- [Incentives & donations](incentives-and-donations.md): where incentive and donation information comes from and when it appears.
- [Intermission, countdown & other panels](intermission-and-more.md)
- [Troubleshooting](troubleshooting.md)

## Golden rules

- **If a graphic doesn't reflect a change, refresh it.** In OBS: right-click the browser source → *Refresh cache of current page*.
- **Most changes are instant.** Anything ticked or typed on the dashboard appears on the graphics within a second or two.
  Donation and incentive information comes from the donation tracker and updates every 15 seconds.
- **Per-run options reset themselves.** Confetti and the over-estimate warning switch back off whenever the run changes, so turn them on for each run that wants them.
