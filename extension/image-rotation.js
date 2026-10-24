import { orderBy } from 'lodash-es';
import { isMet } from './util/bids.js';
import { assetsRotationImages, imageRotation, layoutRotation, trackerBids } from './util/replicants.js';
import { sc } from './util/speedcontrol.js';
const cycleLength = 60 * 1000;
// The game layout alternates between images and the current run's incentives.
const layoutImageLength = 40 * 1000;
const layoutBidLength = 20 * 1000;
let lastLayoutBidId = null;
function update() {
    const ordered = orderBy(assetsRotationImages.value, (a) => a.name, 'asc'); // order by name ascending
    if (ordered.length) {
        // If the current image has been visible for the cycle length.
        if (!imageRotation.value || (Date.now() - imageRotation.value.startTimestamp) >= cycleLength) {
            let index = ordered.findIndex(({ sum }) => imageRotation.value?.sum === sum) + 1;
            if (index > (ordered.length - 1))
                index = 0; // return to 0 if reached the end
            imageRotation.value = {
                sum: ordered[index]?.sum || '?', // todo: do better checking!
                startTimestamp: Date.now(),
            };
        }
    }
    else {
        // Remove rotation if no assets available.
        imageRotation.value = null;
    }
}
function updateLayout() {
    const runId = sc.runDataActiveRun.value?.id;
    const bids = trackerBids.value
        .filter((b) => runId && b.runId === runId && !isMet(b))
        .filter((b) => b.type === 'challenge' || b.options.length);
    const { bidId, startTimestamp } = layoutRotation.value;
    const elapsed = Date.now() - startTimestamp;
    const hasImages = assetsRotationImages.value.length > 0;
    const nextBid = () => {
        const bid = bids[(bids.findIndex((b) => b.id === lastLayoutBidId) + 1) % bids.length];
        lastLayoutBidId = bid.id;
        layoutRotation.value = { bidId: bid.id, startTimestamp: Date.now() };
    };
    if (!bids.length) {
        if (bidId !== null)
            layoutRotation.value = { bidId: null, startTimestamp: Date.now() };
    }
    else if (bidId !== null && !bids.some((b) => b.id === bidId)) {
        // Shown bid is no longer available.
        if (hasImages)
            layoutRotation.value = { bidId: null, startTimestamp: Date.now() };
        else
            nextBid();
    }
    else if (bidId === null && (elapsed >= layoutImageLength || !hasImages)) {
        nextBid();
    }
    else if (bidId !== null && elapsed >= layoutBidLength) {
        // If there's no images, just keep cycling through the bids.
        if (hasImages)
            layoutRotation.value = { bidId: null, startTimestamp: Date.now() };
        else
            nextBid();
    }
}
update();
updateLayout();
setInterval(() => {
    update();
    updateLayout();
}, 1000);
