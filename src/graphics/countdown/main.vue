<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { countdown } from '../../browser_shared/replicants';
import { msToTimeStr } from '../../browser_shared/util';

useHead({ title: 'Countdown' });
const remaining = computed(() => countdown?.data?.remaining ?? 0);
const currentCountdown = computed(() => {
  const seconds = Math.round(remaining.value / 1000);
  if (seconds >= 60 * 60 * 10) {
    return msToTimeStr(seconds * 1000);
  }
  if (seconds >= (60 * 60)) {
    return msToTimeStr(seconds * 1000).slice(1);
  }
  return msToTimeStr(seconds * 1000).slice(3);
});
</script>

<template>
  <div class="Background" />
  <div class="Layout FlexColumn" :class="$style.Wrapper">
    <img src="./Logo.svg" :class="$style.Logo">
    <div class="FlexColumn">
      <div :class="$style.Header">
        Getting ready...
      </div>
      <div :class="{ [$style.RemainingTime]: true, [$style.RemainingTimeOff]: remaining <= 0 }">
        {{ currentCountdown }}
      </div>
    </div>
  </div>
</template>

<style lang="css">
/*
  Workaround for CSS ordering being incorrect on build.
  https://github.com/vitejs/vite/issues/3924#issuecomment-1185919568
*/
@import url('../_misc/common.css') layer(layer-1);
</style>

<style lang="scss" module>
.Wrapper {
  height: 1000px;
  justify-content: space-evenly;
}

.Logo {
  width: 80%;
}

.Header {
  font-size: 70px;
  font-weight: 600;
}

.RemainingTime {
  font-size: 250px;
  font-weight: 700;
  margin-bottom: -0.15em;
}

.RemainingTimeOff {
  opacity: 0;
}
</style>
