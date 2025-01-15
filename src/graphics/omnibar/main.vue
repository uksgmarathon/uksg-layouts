<script setup lang="ts">
import { useHead } from '@unhead/vue';
import ClockElem from './components/ClockElem.vue';
import LeftBox from './components/LeftBox.vue';
import TickerElem from './components/TickerElem.vue';

useHead({ title: 'Omnibar' });
</script>

<template>
  <div class="Layout">
    <div class="Flex BorderTop" :class="$style.Wrapper">
      <LeftBox />
      <TickerElem />
      <ClockElem />
    </div>
    <img :class="$style.Logo" src="./RedLogo.png">
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
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(52deg, #083758 30%, #214e6f 100%);
}

/* The logo "hovers" over the top of everything else so it cax extend outside of the bar. */
.Logo {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
}
</style>
