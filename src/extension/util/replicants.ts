import type NodeCG from '@nodecg/types';
import type { Schemas } from '../../types/index.js';
import { nodecg } from './nodecg.js';

// Wrapper for replicants that have a default (based on schema).
function hasDefault<T>(name: string) {
  return nodecg.Replicant<T>(name) as unknown as NodeCG.default.ServerReplicantWithSchemaDefault<T>;
}
// Wrapper for replicants that don't have a default (based on schema).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hasNoDefault<T>(name: string) {
  return nodecg.Replicant<T>(name) as NodeCG.default.ServerReplicant<T>;
}

/**
 * This is where you can declare all of your replicants to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const capturePositions = hasDefault<Schemas.CapturePositions>('capturePositions');
export const donationTotal = hasDefault<Schemas.DonationTotal>('donationTotal');
export const foobar2000Data = hasDefault<Schemas.Foobar2000Data>('foobar2000Data');
export const gameLayouts = hasDefault<Schemas.GameLayouts>('gameLayouts');
