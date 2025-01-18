<script setup lang="ts">
import { useHead } from '@unhead/vue';
import CutOffBorderedElem from '../_misc/components/CutOffBorderedElem.vue';
import UpcomingRun from './components/UpcomingRun.vue';
import MusicTrack from './components/MusicTrack.vue';

useHead({ title: 'Intermission' });
</script>

<template>
  <div class="Background" />
  <div class="Layout">
    <!-- Logo -->
    <div class="Fixed Flex" :class="$style.LogoWrapper">
      <img src="./components/Logo.png" />
    </div>
    <!-- Host -->
    <CutOffBorderedElem
      class="Fixed"
      :class="$style.Host"
      header-colour="#0c3f6b"
      cut-edge-size="8px"
      header-width="50px"
    >
      <template v-slot:header><img src="./components/Host.png" /></template>
      <template v-slot:content>
        <span :class="$style.HostContent">HostName</span>
      </template>
      <template v-slot:subtitle>they/them</template>
    </CutOffBorderedElem>
    <!-- Music -->
    <MusicTrack :class="$style.Music" />
    <UpcomingRun :class="$style.Next" next />
    <UpcomingRun :class="$style.After1" />
    <UpcomingRun :class="$style.After2" />
    <UpcomingRun :class="$style.After3" />
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
.LogoWrapper {
  left: 49px;
  top: 64px;
  width: 610px;
  height: 366px;
}

.Host {
  left: 49px;
  top: 853px;
  width: 610px;
  height: 55px;
}

.HostContent {
  font-size: 22px;
  font-weight: 700;
}

.Music {
  left: 49px;
  top: 905px;
  width: 610px;
  height: 55px;
}

.Next {
  left: 716px;
  top: 46px;
  width: 1156px;
  height: 210px;
}

.After1 {
  left: 716px;
  top: 280px;
  width: 1156px;
  height: 210px;
}

.After2 {
  left: 716px;
  top: 515px;
  width: 1156px;
  height: 210px;
}

.After3 {
  left: 716px;
  top: 750px;
  width: 1156px;
  height: 210px;
}
</style>
