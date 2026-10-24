import type { Schemas } from '../../types/index.js';

/**
 * Checks if a bid is a challenge that has met its goal.
 * These can still be shown when forced, but are left out of any rotations.
 */
export function isMet(bid: Schemas.TrackerBids[0]) {
  return bid.type === 'challenge' && !!bid.goal && bid.total >= bid.goal;
}
