import { difference } from 'lodash';
import foobar2000 from './util/foobar2000.js';
import obs, { type SceneTransitionStarted } from './util/obs.js';

obs.conn.on('SceneTransitionStarted', (d) => {
  const data = d as SceneTransitionStarted;
  // Only run this code is the scene is actually different.
  if (data.toScene !== data.fromScene) {
    // Parse the "parameters" from the scene names and create difference arrays.
    // "Parameters" refers to "SCENE_NAME [PARAMETERS]", e.g. "Intermission [M]"
    enum Params { // possible parameters
      MusicPlay = 'M', // music should be playing
    }
    const regex = () => /\[(.+)\]$/g;
    const toParams = regex().exec(data.toScene)?.[1].replace(/\s/g, '').split(',') ?? [];
    const fromParams = regex().exec(data.fromScene)?.[1].replace(/\s/g, '').split(',') ?? [];
    const toDiff = difference(toParams, fromParams);
    const fromDiff = difference(fromParams, toParams);
    // Helper functions.
    const onlyInCurrent = (s: string) => toDiff.includes(s) && !fromDiff.includes(s);
    const onlyInPrevious = (s: string) => !toDiff.includes(s) && fromDiff.includes(s);

    // Toggle music playback.
    if (onlyInCurrent(Params.MusicPlay)) {
      foobar2000.play().catch(() => {});
    } else if (onlyInPrevious(Params.MusicPlay)) {
      foobar2000.pause().catch(() => {});
    }
  }
});
