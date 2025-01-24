import { nodecg } from './util/nodecg.js';
import obs from './util/obs.js';
import { capturePositions, gameLayouts } from './util/replicants.js';
import { sc } from './util/speedcontrol.js';
// The key used in the "capturePositions" replicant for "Game Layout".
const gameLayoutKey = 'GameLayout';
// Things from the config in more convenient forms/variables.
const obsNames = nodecg.bundleConfig.obs.names;
const obsScene = obsNames.scenes.gameLayout;
// Listens to the replicant that stores the "capture positions" for various graphics
// sent by the browser, to know where to move OBS items.
let positionsInit = false;
capturePositions.on('change', async (val) => {
    // Ignore first emitted event on start up, so we don't needlessly move things,
    // and to avoid race conditions.
    if (!positionsInit) {
        positionsInit = true;
        return;
    }
    // Don't run if OBS integration is disabled or OBS isn't connected.
    if (!nodecg.bundleConfig.obs.enabled || !obs.conn.identified)
        return;
    // Don't run if there's no "Game Layout" values.
    if (!val[gameLayoutKey])
        return;
    const positionAndCrop = async (type, captureName, elemName) => {
        const elem = capturePositions.value[gameLayoutKey][elemName];
        const crop = { top: 0, right: 0, bottom: 0, left: 0 };
        // Only cameras need cropping to fix their aspect ratio.
        if (type === 'camera') {
            // Cameras need cropping if not exactly 16:9.
            // Wider need top/bottom cropping.
            // Thinner need left/right cropping.
            const transform = { sourceWidth: 1920, sourceHeight: 1080 }; // TODO: get from OBS?
            const cameraAR = transform.sourceWidth / transform.sourceHeight;
            const areaAR = elem.width / elem.height;
            if (areaAR > cameraAR) {
                const newHeight = transform.sourceWidth / areaAR;
                const cropAmount = Math.floor((transform.sourceHeight - newHeight) / 2);
                crop.top = cropAmount;
                crop.bottom = cropAmount;
            }
            else if (areaAR < cameraAR) {
                const newWidth = transform.sourceHeight * areaAR;
                const cropAmount = Math.floor((transform.sourceWidth - newWidth) / 2);
                crop.left = cropAmount;
                crop.right = cropAmount;
            }
        }
        try {
            if (elem) {
                // Turn on and configure position and (if needed) cropping.
                await obs.configureSceneItem(obsScene, captureName, elem, crop, true);
            }
            else {
                // Turn off.
                await obs.configureSceneItem(obsScene, captureName, undefined, undefined, false);
            }
        }
        catch (err) {
            nodecg.log.warn('[Game Layout] Error configuring scene item on capture positions change (%s - %s):', captureName, elemName, err);
        }
    };
    // Game Captures
    for (const [i, name] of obsNames.captures.games.entries()) {
        await positionAndCrop('game', name, `Game${i + 1}`);
    }
    // Camera Capture
    await positionAndCrop('camera', obsNames.captures.camera, 'Camera');
});
// Change the game layout based on information supplied via the run data.
let layoutInit = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    // This should only trigger on an actual run change and not on start up.
    if (layoutInit && newVal) {
        // If there's no old run or we changed to another run, try to automatically set the layout.
        if (!oldVal || newVal.id !== oldVal?.id) {
            const code = newVal.customData.layout?.toLowerCase();
            const layout = gameLayouts.value.available.find((l) => l.code.toLowerCase() === code);
            gameLayouts.value.selected = layout?.code ?? null;
        }
    }
    else if (layoutInit && !newVal) {
        // If there's no active run, return to NULL (graphic will reselect the default).
        gameLayouts.value.selected = null;
    }
    layoutInit = true;
});
