# Troubleshooting (users)

Start here if something on stream looks wrong. If none of this helps, ask tech, and point them at the
[developer troubleshooting guide](../dev/troubleshooting.md).

## First things to try

1. **Refresh the graphic.** In OBS, right-click the browser source → *Refresh cache of current page*.
   Graphics don't pick up updates to the layouts until they're refreshed, even if NodeCG was restarted.
2. **Refresh the dashboard** in your browser.
3. **Wait 15 seconds** if it's about donations or incentives; that's how often the tracker is checked.

## The omnibar

| Problem | Likely cause / fix |
| --- | --- |
| Something is stuck on the omnibar | It's probably pinned. Check the top of **Host Control** and press **Release**. |
| Something I showed disappeared early | Pins time out after 30 seconds by default (press **Keep pinned** to extend). Or the item stopped existing, e.g. the incentive was closed or hidden on the tracker. |
| A type of item never appears | It may be switched off in **Omnibar Settings → Rotation → Included in rotation**, or there's nothing to show (no open incentives, no milestones left to reach, no screened donations). |
| "Coming up" times aren't changing | They only count down while the timer is running. See [Omnibar](omnibar.md#about-the-coming-up-times). |
| A message is cut off | Long messages scroll across instead. If it still looks wrong, refresh the omnibar. |

## Donations and incentives

| Problem | Likely cause / fix |
| --- | --- |
| A donation isn't showing | It hasn't been screened yet on the tracker. Donations only appear after screening. |
| A donation's comment isn't showing | The comment hasn't been approved on the tracker. |
| An incentive has disappeared | It's probably been **hidden** on the tracker, or closed without meeting its goal. If it was meant to be closed after meeting its goal, set it to **Closed** (not Hidden) on the tracker. See [Incentives & donations](incentives-and-donations.md#incentives). |
| An incentive doesn't show on its run's intermission card (or isn't marked THIS RUN) | The game name is different on the tracker and in speedcontrol, so they can't be matched. Ask tech to link them. |
| A met incentive isn't in the rotation | That's on purpose: met incentives are only shown when a host chooses to. |

## Game layouts

| Problem | Likely cause / fix |
| --- | --- |
| No confetti when the timer finished | Confetti is off by default and switches back off when the run changes; turn it on in **Game Layout Control** for each run. It only fires as the timer finishes, not if the graphic was loaded afterwards. If you're watching the layout in a browser tab, the tab must be visible (browsers pause animations in background tabs). |
| No over-estimate warning | Same as confetti: choose **Time over** or **Warning chip** in **Game Layout Control** for each run. It only shows while the timer is running or paused. |
| Race finish times aren't showing | They only show in the **2 Player** layouts, for runs with two or more runners/teams, once that runner's timer has been stopped in speedcontrol. |
| Content warnings aren't showing | Check they're ticked in **Run Customisation** for the run that's on (it follows the current run unless you've picked another). They only appear in the game badge on the game layout. |
| A runner's badge or feed colour is wrong | Check **Run Customisation → Colours & badges** for that run. If the schedule was re-imported, settings made there were lost and need setting again. |
| A name box is empty or missing | Runner names come from the speedcontrol schedule; host and commentator names come from **Participant Control** (remember to **Save**). Empty boxes are hidden. |
| The wrong layout is showing | Pick the right one in **Game Layout Control**. It changes automatically on run change only if the schedule says which layout to use. |
| The game/camera aren't lined up with the layout | Tech issue: OBS automation may be off or disconnected, or the OBS source names don't match the config. |

## Intermission

| Problem | Likely cause / fix |
| --- | --- |
| The wrong "coming up next" run | Fix it in **Upcoming Run Control**. It normally moves on when the timer is stopped. |
| Music says "Not Playing" | The music player isn't playing, or isn't connected (tech). |
| No rotating images | None have been uploaded to **Assets → Rotation Images**. |
