// TODO: "Opening" a connection doesn't mean we're connected, we should check that too.
//       This also extends to other things done on "ready".
import { clamp, round } from 'lodash-es';
import osc from 'osc';
import { nodecg } from './nodecg.js';
const config = nodecg.bundleConfig.xr18;
let conn;
const fadesInAction = {};
const faderValues = {};
/**
 * Sends a message over the OSC connection to the XR18.
 * @param msg OSC message
 */
function send(msg) {
    if (!config.enabled || !conn)
        return; // if not enabled, don't send
    conn.send(msg);
    nodecg.log.debug('[Util/XR18] Sent message:', JSON.stringify(msg));
}
/**
 * Helper to set the fader level to the supplied value.
 * @param address Full address of the fader (example: /dca/1/fader)
 * @param value Value to set (0.0 - 1.0)
 */
function setFader(address, value) {
    send({
        address,
        // We make sure the value is between 0 and 1 and is x.xxxx
        args: [{ type: 'f', value: round(clamp(value, 0, 1), 4) }],
    });
}
/**
 * Fades up/down the supplied fader.
 * @param address Full address of the fader (example: /dca/1/fader)
 * @param direction Direction to fade in (up or down)
 */
// TODO: Actually verify the fades work? I'd like to see if it's needed in testing.
function fade(address, direction) {
    // This check isn't "required" but I'd like to not run this needlessly.
    if (!config.enabled || !conn)
        return; // if not enabled, don't send
    nodecg.log.debug('[Util/XR18] Starting fade on %s going %s', address, direction);
    // Stop a fade if it's already happening on this address.
    if (fadesInAction[address]) {
        clearInterval(fadesInAction[address]);
        nodecg.log.debug('[Util/XR18] Cleared an ongoing fade on %s', address);
    }
    const length = config.fadeLength;
    const stepLength = 50; // how often a step should happen, milliseconds
    const start = direction === 'up' ? faderValues[address] ?? 0 : faderValues[address] ?? 0.75;
    const end = direction === 'up' ? 0.75 : 0;
    if (start === end) {
        nodecg.log.debug('[Util/XR18] Will not fade on %s, start and end the same', address);
    }
    const stepCount = length / stepLength; // how many steps we need to do
    const stepSize = (end - start) / stepCount; // how big these steps should be
    let value = start;
    let currentStep = 0;
    setFader(address, value);
    fadesInAction[address] = setInterval(() => {
        value += stepSize;
        currentStep += 1;
        setFader(address, value);
        if (currentStep >= stepCount) {
            if (fadesInAction[address]) {
                clearInterval(fadesInAction[address]);
                fadesInAction[address] = null;
            }
            nodecg.log.debug('[Util/XR18] Ending fade on %s going %s', address, direction);
        }
    }, stepLength);
}
/**
 * Used to help log things on XR18 connections.
 * @param name Name of connection
 * @param connection OSC connection
 */
function logHelper(name, connection) {
    connection.on('error', (err) => {
        nodecg.log.warn('[Util/XR18] Connection error (%s):', name, err);
    });
    connection.on('close', () => {
        nodecg.log.warn('[Util/XR18] Connection closed (%s)', name);
    });
    connection.on('open', () => {
        nodecg.log.debug('[Util/XR18] Connection open (%s)', name);
    });
    connection.on('ready', () => {
        nodecg.log.debug('[Util/XR18] Connection ready (%s)', name);
    });
}
if (config.enabled) {
    // Shared options.
    const options = {
        localAddress: '0.0.0.0',
        remoteAddress: config.ip,
        remotePort: 10024,
        metadata: true,
        broadcast: true, // todo: test!
    };
    // Connection 1: used for xremote only (and some initial commands)!
    const xremoteConn = new osc.UDPPort({
        ...options,
        localPort: 52362,
    });
    logHelper('xremoteConn', xremoteConn);
    xremoteConn.on('ready', () => {
        // We get the fader initial values, because xremote won't do that.
        // TODO: What if we are not fully communicating with the mixer on "ready"?
        Object.values(nodecg.bundleConfig.xr18.faders).forEach((address) => {
            xremoteConn.send({ address, args: [] });
        });
        // /xremote command, needs resending every <10 seconds.
        xremoteConn.send({ address: '/xremote', args: [] });
        setInterval(() => {
            xremoteConn.send({ address: '/xremote', args: [] });
        }, 8 * 1000);
    });
    xremoteConn.on('message', (message) => {
        // Store fader values if received.
        if (message.address.endsWith('/fader')) {
            const args = Array.isArray(message.args) ? message.args[0] : undefined;
            if (args && args.type === 'f' && typeof args.value === 'number') {
                faderValues[message.address] = args.value;
            }
        }
    });
    // Connection 2: used for everything else.
    conn = new osc.UDPPort({
        ...options,
        localPort: 52361,
    });
    logHelper('conn', conn);
    // Open both connections.
    xremoteConn.open();
    conn.open();
    nodecg.log.debug('[Util/XR18] Setup complete');
}
export default {
    fade,
};
