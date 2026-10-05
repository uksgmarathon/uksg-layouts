# Host guide

The omnibar (the bar along the bottom of the screen) normally rotates through upcoming runs, incentives, donations,
milestones and messages on its own. When you're talking about something, you can **show it on the omnibar right away**
so viewers can see what you're talking about.

You do this from the **Host Control** panel (the **Host** tab on the dashboard), or with Stream Deck buttons if tech
has set them up.

## What's on the omnibar now

The box at the top of Host Control always shows what's currently on the omnibar.

- **Rotating automatically**: the omnibar is doing its normal rotation.
- **PINNED** (green box): something has been shown on demand. It stays on screen until you release it, or until it goes
  back to rotating automatically (after 30 seconds by default; the box counts down).

Buttons that appear while something is pinned:

| Button | What it does |
| --- | --- |
| **Release** | Goes straight back to the normal rotation. |
| **Keep pinned** | Restarts the countdown, so it stays up for longer (use this if you're still talking about it). |

## Showing something

Press **Show** next to anything. It slides onto the omnibar straight away and is pinned. The button turns green and
says **Showing** while it's on screen. Pressing it again restarts the countdown, the same as *Keep pinned*.

Two quick buttons are always available:

- **Show: Coming Up**: the next few runs, with roughly how long until each starts.
- **Show: Donation List**: the most recent donations as coloured boxes.

The tabs underneath list everything else:

| Tab | What's in it |
| --- | --- |
| **Incentives** | Every incentive. Ones for the run that's on now are at the top (marked **THIS RUN**). Goals show a progress bar; bid wars show each option's total. Incentives that have already hit their goal are at the bottom, marked **MET**. They're never shown automatically, only when you press Show. |
| **Runs** | The upcoming runs with estimated start times. Showing one puts that run on the omnibar with how long until it starts. |
| **Milestones** | The donation milestones (set up by tech in Omnibar Settings), with how much is left to raise or **REACHED**. |
| **Donations** | Donations that have been checked (screened) by the donation team, newest first, with any comment and what incentive they went towards. Press **Shout-out** to show that donation on the omnibar: the donor's name, the amount, the incentive (with the game) and their comment. Shout-outs only ever appear when you press the button. |
| **Messages** | The custom messages (like the donation link). Messages switched off for the rotation can still be shown here. |

> A donation only appears once the donation team has screened it, and comments only appear once they've been approved.
> See [Incentives & donations](incentives-and-donations.md).

## Stream Deck / Companion buttons

If tech has set up Stream Deck buttons (using Bitfocus Companion), they do the same things as the panel. Typical buttons:

- *Show the current incentive*: picks the most relevant incentive (the current run's, otherwise the next one coming up).
- *Show coming up* / *Show next run*
- *Show the next milestone*
- *Show the latest donation* (as a shout-out) / *Show the donation list*
- *Release*: back to the normal rotation.

Buttons can also show feedback (for example lit up while something is pinned). Ask tech which buttons do what on your
deck; the technical details are in [Configuration](../dev/configuration.md#companion--stream-deck).

## Tips

- If you pin something and it disappears early, it either timed out (30 seconds by default, which tech can change in
  Omnibar Settings) or the thing no longer exists. For example, an incentive might have been closed or hidden on the tracker.
- The omnibar keeps rotating normally while nothing is pinned, so you only need to use this when you want something on screen *now*.
- The **Show** buttons are big enough to use on a tablet.
