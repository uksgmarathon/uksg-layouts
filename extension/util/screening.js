/**
 * Donation screening rules. The public tracker API includes donations (with donor names and comments) before the
 * donation team has screened them, so these decide what may ever be shown.
 * Kept free of imports so they can be tested on their own (see test/screening.test.ts).
 */
// Donations in these "read" states have not been screened yet, so must never be shown.
const unscreenedStates = ['PENDING', 'FLAGGED'];
/**
 * Checks if a donation has completed and been screened by the donation team.
 */
export function isScreened(donation) {
    return donation.transactionstate === 'COMPLETED' && !unscreenedStates.includes(donation.readstate);
}
/**
 * Gets a donation's comment, only if it has been approved.
 */
export function approvedComment(donation) {
    return (donation.commentstate === 'APPROVED' && donation.comment?.trim()) || null;
}
