import { ErrorEvent, EventSource } from 'eventsource';
import { setTimeout as wait } from 'timers/promises';
import { nodecg } from './nodecg.js';
import { foobar2000Data } from './replicants.js';

interface UpdateMsg {
  player?: {
    activeItem: {
      columns: string[];
      duration: number;
      position: number;
    };
    playbackState: 'paused' | 'playing' | 'stopped';
  }
}

const config = nodecg.bundleConfig.foobar2000;
const headers = config.username && config.password
  ? { Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}` }
  : undefined;

/**
 * Used to make a request to the Beefweb foobar2000 plugin.
 * @param method HTTP method
 * @param endpoint Endpoint to request
 * @returns fetch response
 */
async function request(method: string, endpoint: string) {
  nodecg.log.debug('[Util/foobar2000] API %s %s', method.toUpperCase(), endpoint);
  const resp = await fetch(`${config.url}${endpoint}`, { method, headers });
  if (!resp.ok) {
    throw new Error(await resp.text());
  }
  return resp;
}

/**
 * Used to "connect" to the Beefweb foobar2000 plugin.
 */
function connect() {
  const es = new EventSource(`${config.url}/query/updates?player=true&trcolumns=%title%,%artist%`, {
    fetch: (input, init) => fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...headers,
      },
    }),
  });
  const onOpen = () => {
    nodecg.log.debug('[Util/foobar2000] Connected');
    foobar2000Data.value.connected = true;
  };
  const onMessage = (ev: MessageEvent) => {
    let msg: UpdateMsg | undefined;
    try {
      msg = JSON.parse(ev.data as string) as UpdateMsg;
    } catch (err) {
      nodecg.log.warn('[Util/foobar2000] Message parse error:', err);
    }
    if (!msg) return;
    if (msg.player) {
      foobar2000Data.value.playing = msg.player.playbackState === 'playing';
      if (msg.player.playbackState !== 'stopped') {
        foobar2000Data.value.track = {
          title: msg.player.activeItem.columns[0],
          artist: msg.player.activeItem.columns[1],
        };
      } else {
        foobar2000Data.value.track = null;
      }
    }
  };
  const onError = async (ev: ErrorEvent) => {
    nodecg.log.warn('[Util/foobar2000] Connection error');
    foobar2000Data.value.connected = false;
    // If we receive a 401 for authentication error, we need to manually reconnect.
    if (ev.code === 401 || ev.code === 403) {
      nodecg.log.warn('[Util/foobar2000] Authentication error');
      es.close();
      es.removeEventListener('open', onOpen);
      es.removeEventListener('message', onMessage);
      es.removeEventListener('error', onError);
      await wait(5000);
      connect();
    }
  };
  es.addEventListener('open', onOpen);
  es.addEventListener('message', onMessage);
  es.addEventListener('error', onError);
}

/**
 * Used to start playback on foobar2000.
 */
async function play() {
  if (!config.enabled) return;
  try {
    await request('post', '/player/play');
    nodecg.log.debug('[Util/foobar2000] Playing');
  } catch (err) {
    nodecg.log.warn('[Util/foobar2000] Play error:', err);
  }
}

/**
 * Used to pause playback on foobar2000.
 */
async function pause() {
  if (!config.enabled) return;
  try {
    await request('post', '/player/pause');
    nodecg.log.debug('[Util/foobar2000] Paused');
  } catch (err) {
    nodecg.log.warn('[Util/foobar2000] Pause error:', err);
  }
}

if (config.enabled) {
  connect();
  nodecg.log.debug('[Util/foobar2000] Setup complete');
}

export default {
  play,
  pause,
};
