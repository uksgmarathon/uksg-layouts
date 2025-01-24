import OBSWebSocket, { OBSWebSocketError, type OBSEventTypes } from 'obs-websocket-js';
import { setTimeout as wait } from 'timers/promises';
import { nodecg } from './nodecg.js';

const config = nodecg.bundleConfig.obs;
const obs = new OBSWebSocket();

// Types available in our build of obs-websocket.
export type SceneTransitionStarted = {
  transitionDuration: number,
  toScene: string,
  fromScene: string
} & OBSEventTypes['SceneTransitionStarted'];

/**
 * Used to (re)connect to the OBS WebSocket.
 */
async function connect() {
  try {
    const { obsWebSocketVersion, rpcVersion } = await obs.connect(config.url, config.password);
    nodecg.log.debug('[Util/OBS] Connected (version: %s, RPC: %s)', obsWebSocketVersion, rpcVersion);
  } catch (err) {
    try {
      await obs.disconnect();
    } catch { /* ignore errors */ }
    nodecg.log.warn(
      '[Util/OBS] Connection error (reason: %s - %s)',
      (err as OBSWebSocketError).code ?? 'N/A',
      (err as OBSWebSocketError).message || 'N/A',
    )
  }
}

obs.on('ConnectionClosed', async (data) => {
  nodecg.log.warn('[Util/OBS] Connection closed (reason: %s - %s)', data.code ?? 'N/A', data.message || 'N/A');
  await wait(5000);
  await connect();
});

obs.on('ConnectionError', (err) => {
  nodecg.log.warn('[Utill/OBS] Connection error (reason: %s - %s)', err.code, err.message);
});

/**
 * Resets the scene item and sets some properties if possible.
 * @param scene Name of the scene the item is in
 * @param item Name of the item
 * @param area Area object (as used in capturePositions replicant): x, y, width, height
 * @param crop Crop object: top, bottom, left, right
 * @param visible If the source should be visible or not
 */
async function configureSceneItem(
  scene: string,
  item: string,
  area?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  },
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  },
  visible?: boolean,
) {
  // Comment by duncte:
  // > None of this is properly documented btw.
  // > I had to search their discord for this information.
  const response = await obs.callBatch([
    {
      requestType: 'GetSceneItemId',
      requestData: {
        sceneName: scene,
        sourceName: item,
      },
      // @ts-expect-error This is valid, just undocumented and not typed in obs-ws-js
      outputVariables: {
        sceneItemIdVariable: 'sceneItemId',
      },
    },
    {
      requestType: 'SetSceneItemTransform',
      // @ts-expect-error the sceneItemId var is optional because of the input vars
      requestData: {
        sceneName: scene,
        sceneItemTransform: {
          // Bounds
          boundsType: 'OBS_BOUNDS_STRETCH', // TODO: Allow as a parameter?
          boundsWidth: area?.width ?? 1920,
          boundsHeight: area?.height ?? 1080,
          // Position
          positionX: area?.x ?? 0,
          positionY: area?.y ?? 0,
          // Crop
          cropBottom: crop?.bottom ?? 0,
          cropLeft: crop?.left ?? 0,
          cropRight: crop?.right ?? 0,
          cropTop: crop?.top ?? 0,
        },
      },
      inputVariables: {
        sceneItemId: 'sceneItemIdVariable',
      },
    },
    {
      requestType: 'SetSceneItemEnabled',
      // @ts-expect-error the sceneItemId var is optional because of the input vars
      requestData: {
        sceneName: scene,
        sceneItemEnabled: visible ?? true,
      },
      inputVariables: {
        sceneItemId: 'sceneItemIdVariable',
      },
    },
  ], {
    haltOnFailure: true,
  });
  // If there's no result for the first response, it probably means the source
  // doesn't exist on the scene.
  if (!response[0]?.requestStatus.result) {
    throw new Error((response[0]?.requestStatus && 'comment' in response[0].requestStatus)
      ? response[0].requestStatus.comment
      : '');
  }
  // Throw an error if we don't receive all 3 back.
  // TODO: There is a chance the last one is an error.
  if (response.length < 3) {
    throw new Error('not all responses we expected were received');
  }
}

if (config.enabled) {
  await new Promise((res) => {
    obs.on('Identified', res);
    connect().catch(() => {});
  });
  nodecg.log.debug('[Util/OBS] Setup complete');
}

export default {
  conn: obs,
  configureSceneItem,
};
