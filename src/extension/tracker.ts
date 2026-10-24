import { orderBy, round } from 'lodash-es';
import type { Schemas } from '../types/index.js';
import { nodecg } from './util/nodecg.js';
import { donationTotal, trackerBids, trackerDonations } from './util/replicants.js';
import { approvedComment, isScreened } from './util/screening.js';
import { sc } from './util/speedcontrol.js';

type RunData = ReturnType<typeof sc.getRunDataArray>[number];

const config = nodecg.bundleConfig.tracker;
const api = `${config.url}/tracker/api/v2`;
const pollLength = 15 * 1000;
const runsPollLength = 5 * 60 * 1000;
// Without this, a hung tracker would stall polling for minutes (fetch has no timeout of its own).
const requestTimeout = 10 * 1000;

// The parts of the tracker API responses that we use.
interface ApiList<T> {
  next: string | null;
  results: T[];
}
interface ApiEvent {
  id: number;
  amount: number;
}
interface ApiBid {
  id: number;
  bid_type: 'challenge' | 'choice' | 'option';
  name: string;
  full_name: string;
  speedrun: number | null;
  parent: number | null;
  state: string;
  description: string;
  shortdescription: string;
  goal: number | null;
  total: number;
  count: number;
  allowuseroptions?: boolean;
}
interface ApiRun {
  id: number;
  name: string;
  display_name: string;
  category: string;
  order: number | null;
}
interface ApiDonation {
  id: number;
  donor_name: string;
  transactionstate: string;
  readstate: string;
  commentstate: string;
  amount: number;
  timereceived: string;
  comment?: string;
  bids: { bid: number, bid_name: string, amount: number }[];
}

let eventId: number | null = null;
let trackerRuns = new Map<number, ApiRun>();
let runsLastUpdated = 0;

/**
 * Fetches every page of a tracker API list endpoint.
 * @param path Path after the API base URL, including any query string.
 */
async function getAll<T>(path: string) {
  const results: T[] = [];
  let url: string | null = `${api}${path}`;
  while (url) {
    const resp = await fetch(url, { signal: AbortSignal.timeout(requestTimeout) });
    if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText} (${url})`);
    const data = await resp.json() as ApiList<T>;
    results.push(...data.results);
    url = data.next;
  }
  return results;
}

/**
 * Normalises a string for loose comparisons (case/punctuation/spacing insensitive).
 */
function normalise(str?: string | null) {
  return str?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? '';
}

/**
 * Finds the nodecg-speedcontrol run that matches a tracker run.
 * A "trackerRunId" custom data field on the run will be used if set,
 * otherwise we try to match on game name (and category if there's more than 1 match).
 */
function findRunId(trackerRun: ApiRun | undefined, runs: RunData[]) {
  if (!trackerRun) return null;
  const linked = runs.find((r) => r.customData.trackerRunId?.trim() === trackerRun.id.toString());
  if (linked) return linked.id;
  const names = [normalise(trackerRun.name), normalise(trackerRun.display_name)].filter(Boolean);
  const matches = runs.filter((r) => names.includes(normalise(r.game)));
  const categoryMatch = matches.find((r) => normalise(r.category) === normalise(trackerRun.category));
  return (categoryMatch ?? matches[0])?.id ?? null;
}

/**
 * Gets the game name for a bid, from its tracker run (or the bid's full name if that fails).
 */
function getBidGame(bid: ApiBid) {
  const trackerRun = bid.speedrun !== null ? trackerRuns.get(bid.speedrun) : undefined;
  return trackerRun?.display_name || trackerRun?.name || bid.full_name.split(' -- ')[0];
}

/**
 * Checks if a challenge bid has met its goal; the tracker closes these once they have.
 */
function isMetChallenge(bid: ApiBid) {
  return bid.bid_type === 'challenge' && bid.goal !== null && bid.goal > 0 && bid.total >= bid.goal;
}

/**
 * Converts the tracker's bid "tree" into our own format, only including open bids
 * and challenges that have met their goal (so they can still be shown by hosts and on upcoming runs).
 */
function parseBids(bids: ApiBid[]): Schemas.TrackerBids {
  const runs = sc.getRunDataArray();
  const parsed = bids
    .filter((b) => b.parent === null && b.bid_type !== 'option')
    .filter((b) => b.state === 'OPENED' || (b.state === 'CLOSED' && isMetChallenge(b)))
    .map((b) => {
      const trackerRun = b.speedrun !== null ? trackerRuns.get(b.speedrun) : undefined;
      const options = bids
        .filter((o) => o.parent === b.id && o.state === 'OPENED')
        .map((o) => ({ id: o.id, name: o.name, total: round(o.total, 2) }));
      return {
        id: b.id,
        type: b.bid_type as 'challenge' | 'choice',
        name: b.name,
        game: getBidGame(b),
        description: b.description || b.shortdescription,
        trackerRunId: b.speedrun,
        runId: findRunId(trackerRun, runs),
        goal: b.goal,
        total: round(b.total, 2),
        count: b.count,
        allowUserOptions: !!b.allowuseroptions,
        options: orderBy(options, (o) => o.total, 'desc'),
      };
    });
  const runOrder = (b: Schemas.TrackerBids[0]) => (b.trackerRunId !== null
    ? trackerRuns.get(b.trackerRunId)?.order : undefined) ?? Number.MAX_SAFE_INTEGER;
  return orderBy(parsed, [runOrder, 'id']);
}

/**
 * Converts the tracker's donations into our own format, only including screened ones.
 * @param bids All bids (including closed ones) so we can find the names of what was donated to.
 */
function parseDonations(donations: ApiDonation[], bids: ApiBid[]): Schemas.TrackerDonations {
  const bidMap = new Map(bids.map((b) => [b.id, b]));
  return orderBy(donations.filter(isScreened), (d) => Date.parse(d.timereceived), 'desc').slice(0, 50).map((d) => ({
    id: d.id,
    name: d.donor_name,
    amount: round(d.amount, 2),
    comment: approvedComment(d),
    timestamp: Date.parse(d.timereceived),
    bids: d.bids.map((db) => {
      const bid = bidMap.get(db.bid);
      const parent = bid?.parent ? bidMap.get(bid.parent) : undefined;
      const main = parent ?? bid;
      return {
        id: main?.id ?? db.bid,
        game: main ? getBidGame(main) : '',
        name: main?.name ?? db.bid_name,
        option: parent ? (bid?.name ?? db.bid_name) : null,
        amount: db.amount,
      };
    }),
  }));
}

/**
 * Updates the donation total, bids and donations from the API.
 */
async function updateFromApi() {
  try {
    const [event] = await getAll<ApiEvent>(`/events/?short=${config.eventShort}&totals=`);
    if (!event) {
      throw new Error('event with configured short not found on tracker');
    }
    eventId = event.id;
    const total = round(event.amount, 2); // may be unneeded, but good for safety
    if (total !== donationTotal.value) {
      nodecg.log.debug('[Tracker] API donation total changed:', total);
      donationTotal.value = total;
    }

    if (Date.now() - runsLastUpdated >= runsPollLength) {
      const runs = await getAll<ApiRun>(`/events/${eventId}/runs/`);
      trackerRuns = new Map(runs.map((r) => [r.id, r]));
      runsLastUpdated = Date.now();
    }

    const [bids, donations] = await Promise.all([
      getAll<ApiBid>(`/events/${eventId}/bids/?tree`),
      // Only the first page, which contains the most recent donations.
      fetch(`${api}/events/${eventId}/donations/`, { signal: AbortSignal.timeout(requestTimeout) })
        .then(async (resp) => {
          if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText} (donations)`);
          return (await resp.json() as ApiList<ApiDonation>).results;
        }),
    ]);
    trackerBids.value = parseBids(bids);
    trackerDonations.value = parseDonations(donations, bids);
  } catch (err) {
    nodecg.log.warn('[Tracker] Error updating from API:', err);
  }
}

/**
 * Generates some fake data so everything can be tested without a tracker.
 * Bids are attached to the current and next few runs, and values creep up over time.
 */
// Made-up names, so test data (and any screenshots of it) never attributes donations to real people.
const testNames = ['PixelPanda', '(Anonymous)', 'RetroRaccoon', 'Captain Haggis', 'Nessie_Fan', 'GlitchHunter'];
const testComments = [null, 'Good luck with the run!', 'Mountain Pass all the way!', 'Love this event, keep it up everyone! Here\'s a bit extra towards the bonus run, can\'t wait to see it.'];
function updateFromTestData() {
  const rand = (max: number) => Math.floor(Math.random() * max);
  const current = sc.getCurrentRun();
  const runs = [...(current ? [current] : []), ...sc.getNextRuns(3)];
  const prev = new Map(trackerBids.value.map((b) => [b.id, b]));
  const bump = (id: number, base: number) => round((prev.get(id)?.total ?? base) + (rand(3) === 0 ? rand(25) : 0), 2);
  const optionTotal = (bidId: number, optionId: number, base: number) => {
    const old = prev.get(bidId)?.options.find((o) => o.id === optionId)?.total ?? base;
    return round(old + (rand(3) === 0 ? rand(20) : 0), 2);
  };
  const choice = (id: number, name: string, game: string, runId: string | null, options: string[]) => {
    const opts = options.map((o, i) => ({ id: (id * 10) + i, name: o, total: optionTotal(id, (id * 10) + i, 50 * (options.length - i)) }));
    return {
      id, type: 'choice' as const, name, game, description: `Which will it be in ${game}?`, trackerRunId: null, runId,
      goal: null, total: opts.reduce((p, o) => p + o.total, 0), count: 10, allowUserOptions: false,
      options: orderBy(opts, (o) => o.total, 'desc'),
    };
  };
  trackerBids.value = [
    {
      id: 1, type: 'challenge', name: 'All Bonus Stages Showcase (Including Every Secret Exit)', game: runs[1]?.game ?? 'Test Game', description: 'Can we see even more?',
      trackerRunId: null, runId: runs[1]?.id ?? null, goal: 500, total: bump(1, 278), count: 12, allowUserOptions: false, options: [],
    },
    choice(2, 'Choose the Route', runs[0]?.game ?? 'Test Game', runs[0]?.id ?? null, ['Mountain Pass', 'Coastal Road']),
    choice(3, 'Character Bid War', runs[0]?.game ?? 'Test Game 2', runs[0]?.id ?? null, ['Ax Battler', 'Gillius Thunderhead', 'Tyrus Flaire', 'Death Adder (Secret Character)']),
    {
      id: 4, type: 'challenge', name: 'Upgrade to Expert', game: runs[2]?.game ?? 'Test Game 3', description: 'Hard mode, but harder.',
      trackerRunId: null, runId: runs[2]?.id ?? null, goal: 300, total: bump(4, 101), count: 4, allowUserOptions: false, options: [],
    },
  ];
  if (rand(2) === 0 || !trackerDonations.value.length) {
    const amount = [5, 10, 20, 25, 50, 100, 218][rand(7)];
    const bid = trackerBids.value[rand(trackerBids.value.length)];
    trackerDonations.value = [{
      id: Date.now(),
      name: testNames[rand(testNames.length)],
      amount,
      comment: testComments[rand(testComments.length)],
      timestamp: Date.now(),
      bids: rand(2) === 0 && bid
        ? [{ id: bid.id, game: bid.game, name: bid.name, option: bid.options[0]?.name ?? null, amount }]
        : [],
    }, ...trackerDonations.value].slice(0, 50);
    donationTotal.value = round(donationTotal.value + amount, 2);
  }
}

function update() {
  const promise = config.useTestData ? Promise.resolve(updateFromTestData()) : updateFromApi();
  promise
    .catch((err) => { nodecg.log.warn('[Tracker] Error updating:', err); })
    .finally(() => { setTimeout(update, pollLength); });
}

if (config.enabled) {
  update();
}
