import { isEqual, maxBy } from 'lodash-es';
import type { Schemas } from '../types/index.js';
import { isMet } from './util/bids.js';
import { nodecg } from './util/nodecg.js';
import {
  donationTotal,
  milestones,
  omnibar,
  omnibarMessages,
  omnibarSettings,
  trackerBids,
  trackerDonations,
} from './util/replicants.js';
import { sc } from './util/speedcontrol.js';

type Item = NonNullable<Schemas.Omnibar['current']>;
type RotationType = keyof Schemas.OmnibarSettings['types'];

/**
 * Order that item types appear in the rotation; each type cycles through its own items in turn.
 * Messages appear twice so things like the donation link are seen often.
 * "run" and "donation" items are never in the rotation, they are only shown when forced.
 */
const sequence: RotationType[] = ['upcomingRuns', 'goal', 'message', 'bidWar', 'donationList', 'milestone', 'message'];
let sequenceIndex = -1;
const lastShown: Partial<Record<RotationType, Item['id']>> = {};

/**
 * Returns the runs coming up after the current one (or from the start if there isn't one).
 */
function getUpcomingRuns() {
  const runs = sc.getRunDataArray();
  const nextId = sc.runDataActiveRunSurrounding.value.next;
  const index = runs.findIndex((r) => r.id === nextId);
  return index >= 0 ? runs.slice(index) : [];
}

/**
 * Returns the next milestone that hasn't been reached yet.
 */
function getNextMilestone() {
  return maxBy(
    milestones.value.filter((m) => m.amount > donationTotal.value),
    (m) => -m.amount,
  );
}

/**
 * Gets the IDs of everything of a type that can currently be shown in the rotation.
 */
function getRotationIds(type: RotationType): Item['id'][] {
  switch (type) {
    case 'upcomingRuns':
      return getUpcomingRuns().length ? [null] : [];
    case 'goal':
      // Met incentives are only shown if forced.
      return trackerBids.value.filter((b) => b.type === 'challenge' && !isMet(b)).map((b) => b.id);
    case 'bidWar':
      return trackerBids.value.filter((b) => b.type === 'choice' && b.options.length).map((b) => b.id);
    case 'milestone': {
      const milestone = getNextMilestone();
      return milestone ? [milestone.id] : [];
    }
    case 'message':
      return omnibarMessages.value.filter((m) => m.enabled && m.text.trim()).map((m) => m.id);
    case 'donationList':
      return trackerDonations.value.length ? [null] : [];
  }
}

/**
 * Checks if the thing an item refers to still exists and can be shown.
 */
function exists(item: Item) {
  switch (item.type) {
    case 'upcomingRuns':
      return getUpcomingRuns().length > 0;
    case 'run':
      return sc.getRunDataArray().some((r) => r.id === item.id);
    case 'goal':
    case 'bidWar':
      return trackerBids.value.some((b) => b.id === item.id);
    case 'milestone':
      return milestones.value.some((m) => m.id === item.id);
    case 'message':
      // Disabled messages can still be forced, they just aren't in the rotation.
      return omnibarMessages.value.some((m) => m.id === item.id && m.text.trim());
    case 'donationList':
      return trackerDonations.value.length > 0;
    case 'donation':
      return trackerDonations.value.some((d) => d.id === item.id);
  }
}

/**
 * Works out the next item to show in the rotation, skipping types that are disabled or have nothing to show.
 */
function getNextItem(): Item | null {
  const enabled = omnibarSettings.value.types;
  for (let i = 1; i <= sequence.length; i += 1) {
    const index = (sequenceIndex + i) % sequence.length;
    const type = sequence[index];
    const ids = enabled[type] ? getRotationIds(type) : [];
    if (ids.length) {
      const id = ids[(ids.indexOf(lastShown[type] ?? null) + 1) % ids.length];
      sequenceIndex = index;
      lastShown[type] = id;
      return { type, id };
    }
  }
  return null;
}

function showNext() {
  omnibar.value.current = getNextItem();
  omnibar.value.startTimestamp = Date.now();
}

/**
 * Pins an item to the omnibar until it is released (or the pin times out).
 * Forcing the item that is already pinned will restart the timeout.
 */
function force(item: Item) {
  if (!exists(item)) return false;
  const now = Date.now();
  const timeout = omnibarSettings.value.pinTimeout;
  omnibar.value = {
    current: item,
    startTimestamp: now,
    pinned: { item, timestamp: now, expiresTimestamp: timeout > 0 ? now + (timeout * 1000) : null },
  };
  nodecg.log.info('[Omnibar] Pinned item:', item.type, item.id);
  return true;
}

/**
 * Releases any pinned item; the rotation resumes with a fresh timer.
 */
function release() {
  if (omnibar.value.pinned) nodecg.log.info('[Omnibar] Released pinned item');
  omnibar.value.pinned = null;
  showNext();
}

function tick() {
  const { current, startTimestamp, pinned } = omnibar.value;
  if (pinned) {
    const expired = pinned.expiresTimestamp !== null && Date.now() >= pinned.expiresTimestamp;
    if (expired || !exists(pinned.item)) release();
    else if (!isEqual(current, pinned.item)) omnibar.value.current = pinned.item;
    return;
  }
  const duration = omnibarSettings.value.itemDuration * 1000;
  if (!current || !exists(current) || current.type === 'run' || current.type === 'donation'
    || Date.now() - startTimestamp >= duration) {
    showNext();
  }
}

/**
 * Picks the most relevant thing to show for a type, for when something is forced without an ID.
 * For bids, this prefers the current run, then the soonest upcoming one.
 */
function getDefaultItem(type: Item['type']): Item | null {
  switch (type) {
    case 'upcomingRuns':
    case 'donationList':
      return { type, id: null };
    case 'run': {
      const run = getUpcomingRuns()[0];
      return run ? { type, id: run.id } : null;
    }
    case 'goal':
    case 'bidWar': {
      const runs = sc.getRunDataArray();
      const currentIndex = Math.max(0, runs.findIndex((r) => r.id === sc.runDataActiveRun.value?.id));
      const runIndex = (id: string | null) => runs.findIndex((r) => r.id === id);
      const bids = trackerBids.value
        .filter((b) => b.type === (type === 'goal' ? 'challenge' : 'choice'))
        .filter((b) => b.type === 'challenge' || b.options.length);
      // Prefer incentives that are still open for donations over ones already met.
      const unmet = bids.filter((b) => !isMet(b));
      const bid = unmet.find((b) => runIndex(b.runId) >= currentIndex) ?? unmet[0]
        ?? bids.find((b) => runIndex(b.runId) >= currentIndex) ?? bids[0];
      return bid ? { type, id: bid.id } : null;
    }
    case 'milestone': {
      const milestone = getNextMilestone();
      return milestone ? { type, id: milestone.id } : null;
    }
    case 'message': {
      const message = omnibarMessages.value.find((m) => m.enabled && m.text.trim());
      return message ? { type, id: message.id } : null;
    }
    case 'donation': {
      const donation = trackerDonations.value[0];
      return donation ? { type, id: donation.id } : null;
    }
  }
}

// Messages from the dashboard.
nodecg.listenFor('omnibar_force', (item: Item, ack) => {
  const success = force(item);
  if (ack && !ack.handled) ack(success ? null : new Error('item cannot be shown'));
});
nodecg.listenFor('omnibar_release', (_data: unknown, ack) => {
  release();
  if (ack && !ack.handled) ack(null);
});

/**
 * HTTP endpoints so things like Bitfocus Companion can control the omnibar.
 * /omnibar/force/<type>[?id=<id>] pins something, picking the most relevant item if no ID is supplied.
 * /omnibar/release releases anything pinned.
 * /omnibar/state returns what is currently shown, for button feedback.
 */
const router = nodecg.Router();
const routeTypes: Record<string, Item['type']> = {
  'upcoming-runs': 'upcomingRuns',
  'next-run': 'run',
  'goal': 'goal',
  'bid-war': 'bidWar',
  'milestone': 'milestone',
  'message': 'message',
  'donations': 'donationList',
  'donation': 'donation',
};
router.all('/omnibar/force/:type', (req, res) => {
  const type = routeTypes[req.params.type];
  const rawId = req.query.id;
  let item: Item | null = null;
  if (req.params.type === 'incentive') {
    // Whichever is most relevant out of goals and bid wars.
    const goal = getDefaultItem('goal');
    const bidWar = getDefaultItem('bidWar');
    const index = (i: Item | null) => trackerBids.value.findIndex((b) => b.id === i?.id);
    item = [goal, bidWar].filter(Boolean).sort((a, b) => index(a) - index(b))[0] ?? null;
  } else if (type && typeof rawId === 'string' && rawId) {
    const numeric = ['goal', 'bidWar', 'donation'].includes(type);
    item = { type, id: numeric ? Number(rawId) : rawId };
  } else if (type) {
    item = getDefaultItem(type);
  }
  if (!item || !force(item)) {
    res.status(404).send('Nothing to show');
    return;
  }
  res.status(200).send('OK!');
});
router.all('/omnibar/release', (_req, res) => {
  release();
  res.status(200).send('OK!');
});
router.get('/omnibar/state', (_req, res) => {
  const { current, pinned } = omnibar.value;
  res.json({
    type: current?.type ?? null,
    id: current?.id ?? null,
    pinned: !!pinned,
    pinRemainingSeconds: pinned?.expiresTimestamp
      ? Math.max(0, Math.round((pinned.expiresTimestamp - Date.now()) / 1000))
      : null,
  });
});
nodecg.mount('/uksg-layouts', router);

/**
 * Celebrate when the total crosses a milestone, or a multiple of the "celebration step".
 */
donationTotal.on('change', (newVal, oldVal) => {
  if (typeof oldVal !== 'number' || newVal <= oldVal) return;
  const crossed = maxBy(milestones.value.filter((m) => oldVal < m.amount && newVal >= m.amount), (m) => m.amount);
  const step = omnibarSettings.value.celebrationStep;
  if (crossed) {
    nodecg.sendMessage('omnibar_celebrate', { amount: crossed.amount, name: crossed.name });
  } else if (step > 0 && Math.floor(newVal / step) > Math.floor(oldVal / step)) {
    nodecg.sendMessage('omnibar_celebrate', { amount: Math.floor(newVal / step) * step, name: null });
  }
});

tick();
setInterval(tick, 1000);
