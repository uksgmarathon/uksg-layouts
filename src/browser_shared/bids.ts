import type { Schemas } from '../types';

/**
 * Checks if a bid is a challenge that has met its goal.
 */
export function isMet(bid: Schemas.TrackerBids[0]) {
  return bid.type === 'challenge' && !!bid.goal && bid.total >= bid.goal;
}
