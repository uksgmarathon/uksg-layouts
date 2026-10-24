import { getPlayerCustomisation } from '../../browser_shared/customisation';
import { runCustomisation, runDataActiveRun } from '../../browser_shared/replicants';

/**
 * Returns a function that gives the style needed to colour a game feed's border to match a team's player
 * (if a feed colour has been customised for the current run).
 */
export function useFeedStyle() {
  return (teamIndex: number) => {
    const colour = getPlayerCustomisation(runDataActiveRun?.data, runCustomisation?.data, teamIndex).feedColour;
    return colour ? { borderColor: colour } : undefined;
  };
}
