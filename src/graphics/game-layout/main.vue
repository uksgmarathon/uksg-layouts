<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gameLayouts } from '../../browser_shared/replicants';
import { wait } from '../../browser_shared/util';
import type { Schemas } from '../../types';
import { generateClipPath } from '../_misc/cut-background';

useHead({ title: 'Game Layout' });
const route = useRoute();
const router = useRouter();
const clipPath = ref('unset');

/**
 * Returns the available layouts based on the router list.
 */
function getAvailable() {
  return router.getRoutes().reduce<Schemas.GameLayouts['available']>((prev, { name, path }) => {
    if (typeof name === 'string') prev.push({ name, code: path.replace('/', '')});
    return prev;
  }, []);
}

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

// Do stuff that should happen when layout changes.
router.afterEach(async () => {
  await nextTick();
  clipPath.value = generateClipPath();
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
  <div class="Background" :class="$style.ClipPath" />
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
