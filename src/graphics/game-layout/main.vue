<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { capturePositions, gameLayouts } from '../../browser_shared/replicants';
import { wait } from '../../browser_shared/util';
import type { Schemas } from '../../types';
import { generateClipPath } from '../_misc/cut-background';

useHead({ title: 'Game Layout' });
const route = useRoute();
const router = useRouter();
const clipPath = ref('unset');

// Allows you to specify a certain layout type in the parameters (e.g. ?override=16x9-1p).
// TODO: See if we can access these via vue-router (I couldn't when trying to get this in quickly).
const params = new URLSearchParams(document.location.search);
const override = params.get('override');

/**
 * Returns the available layouts based on the router list.
 */
function getAvailable() {
  return router.getRoutes().reduce<Schemas.GameLayouts['available']>((prev, { name, path }) => {
    if (typeof name === 'string') prev.push({ name, code: path.replace('/', '')});
    return prev;
  }, []);
}

/**
 * Updates the stored information about where captures should be located
 * based on "Capture" class elements.
 */
async function updateCapturePositionsData() {
  // Wait for replicant to become ready.
  while (!capturePositions?.data) {
    await wait(100);
  }
  const captureElems = document.getElementsByClassName('Capture');
  const pos = Array.from(captureElems).reduce<Schemas.CapturePositions[0]>((prev, el) => {
    if (!el.id) return prev; // If there's no ID on the element, no reason to store it.
    const sizes = el.getBoundingClientRect();
    // Get the widths of all the borders to figure out the position/size without them.
    const topBorder = getComputedStyle(el).getPropertyValue('border-top-width');
    const rightBorder = getComputedStyle(el).getPropertyValue('border-right-width');
    const bottomBorder = getComputedStyle(el).getPropertyValue('border-bottom-width');
    const leftBorder = getComputedStyle(el).getPropertyValue('border-left-width');
    const calcSizes = {
      x: sizes.x + parseInt(leftBorder),
      y: sizes.y + parseInt(topBorder),
      width: sizes.width - parseInt(rightBorder) - parseInt(leftBorder),
      height: sizes.height - parseInt(bottomBorder) - parseInt(topBorder),
    };
    return Object.assign(prev, { [el.id]: calcSizes });
  }, {});
  capturePositions.data.GameLayout = pos;
  capturePositions.save();
}

if (!override) {
  // Watches if the select layout changes and points the route to the correct one.
  watch(() => gameLayouts?.data?.selected, (selected) => {
    // If the selected value is NULL then fill it in with the default route.
    // This is the only time this graphic changes this value!
    if (selected === null && gameLayouts?.data) {
      gameLayouts.data.selected = route.path.replace('/', '');
      gameLayouts.save();
    } else if (typeof selected === 'string') {
      router.push(`/${selected}`);
    }
  }, { immediate: true });
} else {
  router.push(`/${override}`);
}

// Do stuff that should happen when layout changes.
router.afterEach(async () => {
  await nextTick();
  clipPath.value = generateClipPath();
  if (!override) await updateCapturePositionsData();
});

onMounted(async () => {
  // Wait for replicant to become ready.
  while (!gameLayouts?.data) {
    await wait(100);
  }
  gameLayouts.data.available = getAvailable();
  gameLayouts.save();
});
</script>

<template>
  <div
    class="Background"
    :class="$style.ClipPath"
  />
  <RouterView class="Layout" />
</template>

<style lang="css">
/*
  Workaround for CSS ordering being incorrect on build.
  https://github.com/vitejs/vite/issues/3924#issuecomment-1185919568
*/
@import url('../_misc/common.css') layer(layer-1);
</style>

<style lang="scss" module>
.ClipPath {
  clip-path: v-bind(clipPath);
}
</style>
