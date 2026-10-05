# Incentives & donations

All donation and incentive information comes from the **donation tracker** (the website donations are made through).
The graphics check the tracker **every 15 seconds**, so a change on the tracker can take up to 15 seconds to appear.

## Donations

- A donation only appears on the graphics **after the donation team has screened it** on the tracker. Until then it's
  invisible to the graphics, even though it may already count towards the total.
- A donation's **comment** only appears once the donation team has **approved** it.
- The **donation total** is the tracker's own total, so it may include donations that haven't been screened yet.

Where donations appear:

| Where | What |
| --- | --- |
| Omnibar donation list | The most recent screened donations, as boxes coloured by amount. |
| Omnibar shout-out | One donation, shown only when a host presses **Shout-out**: name, amount, the incentive it went towards (with the game) and the comment. Long comments scroll. |
| Host Control → Donations | All recent screened donations, for hosts to read out and shout out. |

## Incentives

There are two kinds of incentive on the tracker:

- **Goals**: "If we raise £500, the runner does a bonus run". Shown with a progress bar and how much is left.
  A goal that reaches its target shows **Met!** in gold.
- **Bid wars**: donors choose between options, e.g. which character the runner uses. Two options are shown as a
  tug-of-war; three or more as bars sized by each option's share of the total.

Which incentives appear depends on their state on the tracker:

| Tracker state | On the graphics |
| --- | --- |
| **Open** | Everywhere: omnibar rotation, the image box during its run, the intermission card for its run, Host Control. |
| **Closed, goal met** | Not in any rotation. Shown on the intermission card for its run (with **Met!**) and can be shown by a host from Host Control (marked **MET**). |
| **Closed, goal not met** / **closed bid war** | Not shown. |
| **Hidden** (or pending/denied) | Not shown anywhere. The tracker doesn't make these public, so the graphics can't see them. |

> If an incentive has "disappeared", check its state on the tracker. If it was meant to be closed but was set to
> **Hidden**, change it to **Closed** and it'll come back within 15 seconds.

### How incentives are matched to runs

The tracker and speedcontrol have separate copies of the schedule, so the graphics match an incentive to a run by
**game name** (and category, if a game appears more than once). This decides which intermission card and which run's
image box an incentive shows on, and whether it's marked **THIS RUN** in Host Control.

If a game is named differently in the two places, the incentive won't be linked to its run. Tech can fix this by setting
the run's tracker ID in speedcontrol (see [Configuration](../dev/configuration.md#speedcontrol-custom-data)).

## Milestones

Milestones aren't on the tracker; they're set up in **Omnibar Settings → Milestones** (see [Omnibar](omnibar.md#milestones-tab)).
Their progress uses the donation total from the tracker.
