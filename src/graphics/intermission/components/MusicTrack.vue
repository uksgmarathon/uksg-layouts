<script setup lang="ts">
import { computed } from 'vue';
import { foobar2000Data } from '../../../browser_shared/replicants';
import CutOffBorderedElem from '../../_misc/components/CutOffBorderedElem.vue';

const playing = computed(() => foobar2000Data?.data?.playing ?? false);
const track = computed(() => foobar2000Data?.data?.track ?? null);
</script>

<template>
  <CutOffBorderedElem
    class="Fixed"
    header-colour="#8e0c34"
    cut-edge-size="8px"
    header-width="50px"
  >
    <template v-slot:header><img src="./Music.png" /></template>
    <template v-slot:content>
      <span :class="$style.MusicContent">
        <template v-if="playing">
          {{ track?.title ?? '???' }} - {{ track?.artist ?? '???' }}
        </template>
        <template v-else>
          Not Playing
        </template>
      </span>
    </template>
  </CutOffBorderedElem>
</template>

<style lang="scss" module>
.MusicContent {
  font-size: 20px;
  font-weight: 300;
}
</style>
