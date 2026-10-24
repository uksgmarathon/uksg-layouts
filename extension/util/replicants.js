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
export const assetsRotationImages = hasDefault('assets:rotation-images');
export const capturePositions = hasDefault('capturePositions');
export const contentWarnings = hasDefault('contentWarnings');
export const countdown = hasDefault('countdown');
export const donationTotal = hasDefault('donationTotal');
export const foobar2000Data = hasDefault('foobar2000Data');
export const gameLayouts = hasDefault('gameLayouts');
export const imageRotation = hasDefault('imageRotation');
export const layoutRotation = hasDefault('layoutRotation');
export const layoutSettings = hasDefault('layoutSettings');
export const milestones = hasDefault('milestones');
export const omnibar = hasDefault('omnibar');
export const omnibarMessages = hasDefault('omnibarMessages');
export const omnibarSettings = hasDefault('omnibarSettings');
export const participants = hasDefault('participants');
export const runCustomisation = hasDefault('runCustomisation');
export const trackerBids = hasDefault('trackerBids');
export const trackerDonations = hasDefault('trackerDonations');
export const upcomingRunId = hasDefault('upcomingRunId');
