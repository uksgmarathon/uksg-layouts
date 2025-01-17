import { SpeedcontrolUtil } from 'speedcontrol-util';
import { nodecg } from './util/nodecg.js';
const sc = new SpeedcontrolUtil(nodecg);
const router = nodecg.Router();
router.post('/timer/toggle', async (req, res) => {
    const data = req.body;
    if (!data.button_id)
        return;
    if (data.button_id < 1 || data.button_id > 2)
        return; // these buttons don't exist
    const run = sc.getCurrentRun();
    const id = (run && run.teams.length > 1) ? (data.button_id - 1) : 0;
    try {
        // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
        // we do not need to check that here.
        switch (sc.timer.value.state) {
            case 'stopped':
            case 'paused':
                await sc.startTimer();
                break;
            case 'running':
                // Only allow stop command to work if timer is more than 10s.
                if (sc.timer.value.milliseconds > (10 * 1000)) {
                    await sc.stopTimer(id);
                }
                break;
            default:
                // Don't do anything
                break;
        }
    }
    catch {
        // Silently drop for now.
    }
    res.status(200).send('OK!');
});
nodecg.mount('/uksg-layouts', router);
