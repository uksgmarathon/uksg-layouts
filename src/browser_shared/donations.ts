import { orderBy } from 'lodash-es';
import { omnibarSettings } from './replicants';
import { formatCurrencyAmount } from './util';

/**
 * Gets the colour to use for a donation, based on the highest tier it meets.
 */
export function getDonationColour(amount: number) {
  const tiers = orderBy(omnibarSettings?.data?.donationTiers ?? [], (t) => t.amount, 'desc');
  return tiers.find((t) => amount >= t.amount)?.colour ?? tiers[tiers.length - 1]?.colour ?? '#2f6f9d';
}

/**
 * Formats what a donation went towards (e.g. "Golden Axe - Character Bid War: Gillius Thunderhead").
 */
export function formatDonationBid(bid: { game: string, name: string, option: string | null }) {
  const name = bid.option ? `${bid.name}: ${bid.option}` : bid.name;
  return bid.game ? `${bid.game} - ${name}` : name;
}

/**
 * Formats a donation amount, without the pence if it's a whole amount (e.g. "£10" but "£12.50").
 */
export function formatDonationAmount(amount: number) {
  return formatCurrencyAmount(amount, Number.isInteger(amount));
}
