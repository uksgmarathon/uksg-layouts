import { ErrorEvent, EventSource } from 'eventsource';
import { setTimeout as wait } from 'timers/promises';
import { nodecg } from './nodecg.js';

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

/**
 * Used to "connect" to the Beefweb foobar2000 plugin.
 */
function connect() {
  const es = new EventSource(`${config.url}/query/updates?player=true&trcolumns=%title%,%artist%`, {
    fetch: (input, init) => fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(config.username && config.password ? {
          Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`,
        } : undefined),
      },
    }),
  });
  const onOpen = () => {
    nodecg.log.debug('[Util/foobar2000] Connected');
  };
  const onMessage = (ev: MessageEvent) => {
    let msg: UpdateMsg | undefined;
    try {
      msg = JSON.parse(ev.data as string) as UpdateMsg;
    } catch (err) {
      nodecg.log.warn('[Util/foobar2000] Message parse error:', err);
    }
    if (!msg) return;
    // TODO: things with message
  };
  const onError = async (ev: ErrorEvent) => {
    nodecg.log.warn('[Util/foobar2000] Connection error');
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

if (config.enabled) {
  connect();
  nodecg.log.debug('[Util/foobar2000] Setup complete');
}
