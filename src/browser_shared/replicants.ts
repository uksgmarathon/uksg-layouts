import { useReplicant } from 'nodecg-vue-composable';
import type { RunDataActiveRun, Timer } from 'speedcontrol-util/types';
import type { Schemas } from '../types';

const thisBundle = 'uksg-layouts';

/**
 * This is where you can declare all of your replicants to import easily into other (browser based) files.
 * "useReplicant" is a helper composable to make accessing/modifying replicants easier.
 * For more information see https://github.com/Dan-Shields/nodecg-vue-composable
 */
export const capturePositions = useReplicant<Schemas.CapturePositions>('capturePositions', thisBundle);
export const donationTotal = useReplicant<Schemas.DonationTotal>('donationTotal', thisBundle);
export const foobar2000Data = useReplicant<Schemas.Foobar2000Data>('foobar2000Data', thisBundle);
export const gameLayouts = useReplicant<Schemas.GameLayouts>('gameLayouts', thisBundle);
export const runDataActiveRun = useReplicant<RunDataActiveRun>('runDataActiveRun', 'nodecg-speedcontrol');
export const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');
