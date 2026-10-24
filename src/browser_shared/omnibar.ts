import type { Schemas } from '../types';
import { milestones, omnibarMessages, runDataArray, trackerBids, trackerDonations } from './replicants';
import { formatCurrencyAmount } from './util';

export type OmnibarItem = NonNullable<Schemas.Omnibar['current']>;

export const itemTypeNames: Record<OmnibarItem['type'], string> = {
  upcomingRuns: 'Coming Up',
  run: 'Run',
  goal: 'Incentive',
  bidWar: 'Bid War',
  milestone: 'Milestone',
  message: 'Message',
  donationList: 'Donation List',
  donation: 'Donation Shout-out',
};

/**
 * Gets a short human readable description of an omnibar item, for use on the dashboard.
 */
export function describeItem(item: OmnibarItem | null | undefined) {
  if (!item) return 'Nothing';
  const type = itemTypeNames[item.type];
  switch (item.type) {
    case 'run': {
      const run = runDataArray?.data?.find((r) => r.id === item.id);
      return `${type}: ${run?.game ?? '?'}`;
    }
    case 'goal':
    case 'bidWar': {
      const bid = trackerBids?.data?.find((b) => b.id === item.id);
      return `${type}: ${bid ? `${bid.game} - ${bid.name}` : '?'}`;
    }
    case 'milestone': {
      const milestone = milestones?.data?.find((m) => m.id === item.id);
      return `${type}: ${milestone ? `${formatCurrencyAmount(milestone.amount, true)} - ${milestone.name}` : '?'}`;
    }
    case 'message':
      return `${type}: ${omnibarMessages?.data?.find((m) => m.id === item.id)?.text ?? '?'}`;
    case 'donation': {
      const donation = trackerDonations?.data?.find((d) => d.id === item.id);
      return `${type}: ${donation ? `${donation.name} (${formatCurrencyAmount(donation.amount)})` : '?'}`;
    }
    default:
      return type;
  }
}

/**
 * Pins an item to the omnibar until it is released.
 */
export function forceItem(type: OmnibarItem['type'], id: OmnibarItem['id'] = null) {
  return nodecg.sendMessage('omnibar_force', { type, id });
}

/**
 * Releases any pinned item, so the omnibar goes back to rotating.
 */
export function releaseItem() {
  return nodecg.sendMessage('omnibar_release');
}

/**
 * Checks if an item is the one currently pinned.
 */
export function isPinned(pinned: Schemas.Omnibar['pinned'] | undefined, type: OmnibarItem['type'], id: OmnibarItem['id'] = null) {
  return !!pinned && pinned.item.type === type && pinned.item.id === id;
}
