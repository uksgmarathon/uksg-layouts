import { orderBy } from 'lodash-es';
import { assetsRotationImages, imageRotation } from './util/replicants.js';

const cycleLength = 60 * 1000;

function update() {
  const ordered = orderBy(assetsRotationImages.value, (a) => a.name, 'asc'); // order by name ascending
  if (ordered.length) {
    // If the current image has been visible for the cycle length.
    if (!imageRotation.value || (Date.now() - imageRotation.value.startTimestamp) >= cycleLength) {
      let index = ordered.findIndex(({ sum }) => imageRotation.value?.sum === sum) + 1;
      if (index > (ordered.length - 1)) index = 0; // return to 0 if reached the end
      imageRotation.value = {
        sum: ordered[index]?.sum || '?', // todo: do better checking!
        startTimestamp: Date.now(),
      };
    }
  } else {
    // Remove rotation if no assets available.
    imageRotation.value = null;
  }
}

update();
setInterval(update, 1000);
