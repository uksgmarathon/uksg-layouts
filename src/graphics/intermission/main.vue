<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { participants, runDataArray, upcomingRunId } from '../../browser_shared/replicants';
import CutOffBorderedElem from '../_misc/components/CutOffBorderedElem.vue';
import ImageRotation from '../_misc/components/ImageRotation.vue';
import MusicTrack from './components/MusicTrack.vue';
import UpcomingRun from './components/UpcomingRun.vue';

useHead({ title: 'Intermission' });
const theme = nodecg.bundleConfig.theme;

const nextRuns = computed(() => {
  const runIndex = runDataArray?.data?.findIndex((r) => r.id === upcomingRunId?.data);
  if (typeof runIndex === 'number' && runIndex >= 0) {
    return runDataArray?.data?.slice(runIndex, runIndex + 4) ?? [];
  }
  return [];
});

const reader = computed(() => participants?.data?.readers[0]);
</script>

<template>
  <div class="Background" />
  <div class="Layout">
    <!-- Logo -->
    <div
      class="Fixed Flex"
      :class="$style.LogoWrapper"
    >
      <img
        v-if="theme === 'red'"
        :class="$style.Logo"
        src="./RedLogo.svg"
      >
      <img
        v-else-if="theme === 'green'"
        :class="$style.Logo"
        src="./GreenLogo.svg"
      >
      <img
        v-else-if="theme === 'blue'"
        :class="$style.Logo"
        src="./BlueLogo.svg"
      >
    </div>
    <ImageRotation
      class="Fixed"
      :class="$style.ImageRotation"
    />
    <!-- Host -->
    <CutOffBorderedElem
      class="Fixed"
      :class="$style.Host"
      header-colour="#0c3f6b"
      cut-edge-size="8px"
      header-width="50px"
    >
      <template #header>
        <img src="./components/Host.png">
      </template>
      <template #content>
        <span :class="$style.HostContent">{{ reader?.name || '???' }}</span>
      </template>
      <template
        v-if="reader?.pronouns"
        #subtitle
      >
        {{ reader?.pronouns }}
      </template>
    </CutOffBorderedElem>
    <!-- Music -->
    <MusicTrack :class="$style.Music" />
    <!-- Upcoming Runs -->
    <UpcomingRun
      :run-data="nextRuns[0]"
      :class="$style.Next"
      next
    />
    <UpcomingRun
      :run-data="nextRuns[1]"
      :class="$style.After1"
    />
    <UpcomingRun
      :run-data="nextRuns[2]"
      :class="$style.After2"
    />
    <UpcomingRun
      :run-data="nextRuns[3]"
      :class="$style.After3"
    />
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

.Logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ImageRotation {
  left: 49px;
  top: 489px;
  width: 610px;
  height: 304px;
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
