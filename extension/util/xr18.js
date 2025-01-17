// TODO: "Opening" a connection doesn't mean we're connected, we should check that too.
//       This also extends to other things done on "ready".
import osc from 'osc';
import { nodecg } from './nodecg.js';
const config = nodecg.bundleConfig.xr18;
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
        // /xremote command, needs resending every <10 seconds.
        xremoteConn.send({ address: '/xremote', args: [] });
        setInterval(() => {
            xremoteConn.send({ address: '/xremote', args: [] });
        }, 8 * 1000);
    });
    // Connection 2: used for everything else.
    const conn = new osc.UDPPort({
        ...options,
        localPort: 52361,
    });
    logHelper('conn', conn);
    // Open both connections.
    xremoteConn.open();
    conn.open();
    nodecg.log.debug('[Util/XR18] Setup complete');
}
