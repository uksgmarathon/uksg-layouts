import { difference } from 'lodash-es';
import foobar2000 from './util/foobar2000.js';
import { nodecg } from './util/nodecg.js';
import obs, {} from './util/obs.js';
import xr18 from './util/xr18.js';
const { faders } = nodecg.bundleConfig.xr18;
obs.conn.on('SceneTransitionStarted', (d) => {
    const data = d;
    // Only run this code is the scene is actually different.
    if (data.toScene !== data.fromScene) {
        // Parse the "parameters" from the scene names and create difference arrays.
        // "Parameters" refers to "SCENE_NAME [PARAMETERS]", e.g. "Intermission [M,!P,!G]"
        let Params;
        (function (Params) {
            Params["MusicPlay"] = "M";
            Params["NoPlayerMics"] = "!P";
            Params["NoReaderMics"] = "!R";
            Params["NoGameAudio"] = "!G";
        })(Params || (Params = {}));
        const regex = () => /\[(.+)\]$/g;
        const toParams = regex().exec(data.toScene)?.[1].replace(/\s/g, '').split(',') ?? [];
        const fromParams = regex().exec(data.fromScene)?.[1].replace(/\s/g, '').split(',') ?? [];
        const toDiff = difference(toParams, fromParams);
        const fromDiff = difference(fromParams, toParams);
        // Helper functions.
        const onlyInCurrent = (s) => toDiff.includes(s) && !fromDiff.includes(s);
        const onlyInPrevious = (s) => !toDiff.includes(s) && fromDiff.includes(s);
        // Toggle music playback.
        if (onlyInCurrent(Params.MusicPlay)) {
            foobar2000.play().catch(() => { });
        }
        else if (onlyInPrevious(Params.MusicPlay)) {
            foobar2000.pause().catch(() => { });
        }
        // Toggle "player" microphones.
        if (onlyInCurrent(Params.NoPlayerMics)) {
            xr18.fade(faders.player, 'down');
        }
        else if (onlyInPrevious(Params.NoPlayerMics)) {
            xr18.fade(faders.player, 'up');
        }
        // Toggle "reader" microphones.
        if (onlyInCurrent(Params.NoReaderMics)) {
            xr18.fade(faders.reader, 'down');
        }
        else if (onlyInPrevious(Params.NoReaderMics)) {
            xr18.fade(faders.reader, 'up');
        }
        // Toggle "game" audio.
        if (onlyInCurrent(Params.NoGameAudio)) {
            xr18.fade(faders.game, 'down');
        }
        else if (onlyInPrevious(Params.NoGameAudio)) {
            xr18.fade(faders.game, 'up');
        }
    }
});
