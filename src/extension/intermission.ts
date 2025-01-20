import { nodecg } from './util/nodecg.js';
import { upcomingRunId } from './util/replicants.js';
import { sc } from './util/speedcontrol.js';

/**
 * Update replicant that stores the ID of the upcoming run, both on timer stopping,
 * if you somehow have no current run (usually if you're at the start of the run list),
 * and also via a "force" button on the dashboard.
 */
sc.on('timerStopped', () => {
  upcomingRunId.value = sc.runDataActiveRunSurrounding.value.next ?? null;
});
sc.runDataActiveRunSurrounding.on('change', (val) => {
  if (!val.current) upcomingRunId.value = val.next ?? null;
});
nodecg.listenFor('intermission_forceUpcomingRun', (id?: string) => {
  // Check supplied run ID exists in our array.
  const run = sc.getRunDataArray().find((r) => r.id === id);
  upcomingRunId.value = run?.id ?? null;
});
