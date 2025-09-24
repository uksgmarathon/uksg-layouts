import { round } from 'lodash-es';
import { nodecg } from './util/nodecg.js';
import { donationTotal } from './util/replicants.js';
const config = nodecg.bundleConfig.tracker;
/**
 * Updates donation total from the API.
 */
async function updateDonationTotalFromApi() {
    if (config.useTestData) {
        donationTotal.value = round(Math.random() * 10000, 2);
    }
    else {
        try {
            const resp = await fetch(`${config.url}/tracker/api/v2/events/?short=${config.eventShort}&totals=`);
            if (resp.ok) {
                const data = await resp.json();
                if (!data.results.length) {
                    throw new Error('event with configured short not found on tracker');
                }
                const total = round(data.results[0].amount, 2); // may be unneeded, but good for safety
                nodecg.log.debug('[Tracker] API donation total changed:', total);
                donationTotal.value = total;
            }
        }
        catch (err) {
            nodecg.log.warn('[Tracker] Error updating donation total from API:', err);
        }
    }
    setTimeout(() => { updateDonationTotalFromApi().catch(() => { }); }, 30 * 1000);
}
if (config.enabled) {
    updateDonationTotalFromApi().catch((err) => { console.log(err); });
}
