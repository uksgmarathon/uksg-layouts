import { useReplicant } from 'nodecg-vue-composable';
import type { RunDataActiveRun, RunDataActiveRunSurrounding, RunDataArray, Timer } from 'speedcontrol-util/types/schemas';
import type { Schemas } from '../types';

const thisBundle = 'uksg-layouts';
const sc = 'nodecg-speedcontrol';;

/**
 * This is where you can declare all of your replicants to import easily into other (browser based) files.
 * "useReplicant" is a helper composable to make accessing/modifying replicants easier.
 * For more information see https://github.com/Dan-Shields/nodecg-vue-composable
 */
export const capturePositions = useReplicant<Schemas.CapturePositions>('capturePositions', thisBundle);
export const countdown = useReplicant<Schemas.Countdown>('countdown', thisBundle);
export const donationTotal = useReplicant<Schemas.DonationTotal>('donationTotal', thisBundle);
export const foobar2000Data = useReplicant<Schemas.Foobar2000Data>('foobar2000Data', thisBundle);
export const gameLayouts = useReplicant<Schemas.GameLayouts>('gameLayouts', thisBundle);
export const participants = useReplicant<Schemas.Participants>('participants', thisBundle);
export const runDataActiveRun = useReplicant<RunDataActiveRun>('runDataActiveRun', sc);
export const runDataActiveRunSurrounding = useReplicant<RunDataActiveRunSurrounding>('runDataActiveRunSurrounding', sc);
export const runDataArray = useReplicant<RunDataArray>('runDataArray', sc);
export const timer = useReplicant<Timer>('timer', sc);
export const upcomingRunId = useReplicant<Schemas.UpcomingRunId>('upcomingRunId', thisBundle);
