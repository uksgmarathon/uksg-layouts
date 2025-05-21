import { set } from './util/nodecg.js';
export default async (nodecg) => {
    /**
     * Because of how top-level `import`s work, it helps to use `import`s here
     * to force things to be loaded *after* the NodeCG context is set.
     */
    set(nodecg); // set nodecg "context" before anything else
    await import('./util/replicants.js'); // make sure replicants are set up
    await import('./util/obs.js'); // wait on OBS
    await import('./timer.js');
    await import('./tracker.js');
    await import('./intermission.js');
    await import('./audio.js');
    await import('./game-layout.js');
    await import('./countdown.js');
    await import('./image-rotation.js');
};
