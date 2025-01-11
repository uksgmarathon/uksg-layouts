<script setup lang="ts">
import { useHead } from '@unhead/vue';
import ClockElem from './components/ClockElem.vue';
import LeftBox from './components/LeftBox.vue';
import TickerElem from './components/TickerElem.vue';

useHead({ title: 'omnibar' });
</script>

<template>
  <div class="Layout">
    <div class="Flex" :class="$style.Wrapper">
      <LeftBox />
      <TickerElem />
      <ClockElem />
    </div>
    <img :class="$style.Logo" src="./RedLogo.png">
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(52deg, #083758 30%, #214e6f 100%);
  border-top: #44a0e3 3px solid;
  box-sizing: border-box;
}

/* The logo "hovers" over the top of everything else so it cax extend outside of the bar. */
.Logo {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
