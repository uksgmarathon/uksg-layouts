import { SpeedcontrolUtil } from 'speedcontrol-util';
import { nodecg } from './nodecg.js';
// TODO: Not use speedcontrol-util or update it with new typings.
export const sc = new SpeedcontrolUtil(nodecg);
