import { nodecg } from './nodecg.js';
// Wrapper for replicants that have a default (based on schema).
function hasDefault(name) {
    return nodecg.Replicant(name);
}
// Wrapper for replicants that don't have a default (based on schema).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasNoDefault(name) {
    return nodecg.Replicant(name);
}
/**
 * This is where you can declare all of your replicants to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const donationTotal = hasDefault('donationTotal');
export const gameLayouts = hasDefault('gameLayouts');
