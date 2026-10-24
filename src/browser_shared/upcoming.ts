import { computed } from 'vue';
import { useNow } from './now';
import { runDataActiveRun, runDataActiveRunSurrounding, runDataArray, timer } from './replicants';

/**
 * Returns the runs coming up after the current one, with an estimated start time for each
 * based on the time left on the current run and the estimates/setup times of the ones before it.
 */
export function useUpcomingRuns() {
  const now = useNow();
  return computed(() => {
    const runs = runDataArray?.data ?? [];
    const index = runs.findIndex((r) => r.id === runDataActiveRunSurrounding?.data?.next);
    if (index < 0) return [];
    const current = runDataActiveRun?.data;
    let start = now.value;
    if (current) {
      const elapsed = timer?.data?.milliseconds ?? 0;
      const remaining = timer?.data?.state === 'finished'
        ? 0 : Math.max(0, ((current.estimateS ?? 0) * 1000) - elapsed);
      start += remaining + ((current.setupTimeS ?? 0) * 1000);
    }
    return runs.slice(index).map((run) => {
      const runStart = start;
      start += ((run.estimateS ?? 0) + (run.setupTimeS ?? 0)) * 1000;
      return { run, start: runStart, startsIn: runStart - now.value };
    });
  });
}

/**
 * Formats how long until something starts in a rough, human readable way (e.g. "~1h 20m").
 * Rounded to the nearest 5 minutes, as these are only ever estimates.
 * @param ms Milliseconds until it starts.
 */
export function formatStartsIn(ms: number) {
  const mins = Math.round(ms / (1000 * 60 * 5)) * 5;
  if (mins < 5) return 'Next';
  if (mins < 60) return `~${mins}m`;
  const hours = Math.floor(mins / 60);
  return mins % 60 ? `~${hours}h ${mins % 60}m` : `~${hours}h`;
}

/**
 * Gets a string of all the players in a run (teams separated with "vs.").
 */
export function formatPlayers(run: { teams: { name?: string, players: { name: string }[] }[] }) {
  return run.teams
    .map((t) => t.name ?? t.players.map((p) => p.name).join(', '))
    .join(' vs. ');
}
