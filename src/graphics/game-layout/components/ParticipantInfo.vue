<script setup lang="ts">
import { computed } from 'vue';
import { runDataActiveRun } from '../../../browser_shared/replicants';
import CutOffBorderedElem from '../../_misc/components/CutOffBorderedElem.vue';

const props = withDefaults(defineProps<{
  type: 'player' | 'other',
  index?: number,
  headerColour?: string,
  headerText?: string,
  headerFontSize?: string,
  headerWidth?: string,
  nameFontSize?: string,
  cutEdgeSize?: string,
}>(), {
  index: 0,
  headerText: 'Runner',
  headerFontSize: '20px',
  nameFontSize: '26px',
  cutEdgeSize: '15px',
});

const player = computed(() => runDataActiveRun?.data?.teams[props.index].players[0]);
const name = computed(() => props.type === 'player' ? player.value?.name : 'TBD');
const pronouns = computed(() => props.type === 'player' ? player.value?.pronouns : 'TBD');
</script>

<template>
  <CutOffBorderedElem
    class="Fixed"
    :header-colour="headerColour ?? 'linear-gradient(33deg, #1b6ebb 0%, #348bd2 100%)'"
    :header-font-size="headerFontSize"
    :header-width="headerWidth"
    :cut-edge-size="cutEdgeSize"
  >
    <template v-slot:header>{{ headerText }}</template>
    <template v-slot:content>
      <span :class="$style.Content">{{ name ?? '???' }}</span>
    </template>
    <template v-slot:subtitle v-if="pronouns">{{ pronouns }}</template>
  </CutOffBorderedElem>
</template>

<style module lang="scss">
.Content {
  font-size: v-bind(nameFontSize);
  font-weight: 700;
}
</style>
