<script setup lang="ts">
import { computed } from 'vue';
import { participants, runDataActiveRun } from '../../../browser_shared/replicants';
import CutOffBorderedElem from '../../_misc/components/CutOffBorderedElem.vue';

const props = withDefaults(defineProps<{
  type: 'player' | 'host' | 'comm1' | 'comm2',
  index?: number,
  headerColour?: string,
  headerText?: string,
  headerFontSize?: string,
  headerWidth?: string,
  nameFontSize?: string,
  cutEdgeSize?: string,
}>(), {
  index: 0,
  headerColour: 'linear-gradient(33deg, #1b6ebb 0%, #348bd2 100%)',
  headerText: 'Runner',
  headerFontSize: '20px',
  headerWidth: undefined,
  nameFontSize: '26px',
  cutEdgeSize: '15px',
});

const user = computed(() => {
  if (props.type === 'player') return runDataActiveRun?.data?.teams[props.index].players[0];
  if (props.type === 'host') return participants?.data?.readers[0];
  if (props.type === 'comm1') return participants?.data?.commentators[0];
  if (props.type === 'comm2') return participants?.data?.commentators[1];
  return null;
});
const name = computed(() => user.value?.name);
const pronouns = computed(() => user.value?.pronouns);
</script>

<template>
  <CutOffBorderedElem
    class="Fixed"
    :class="{ [$style.WrapperRemove]: !name }"
    :header-colour="headerColour"
    :header-font-size="headerFontSize"
    :header-width="headerWidth"
    :cut-edge-size="cutEdgeSize"
  >
    <template #header>
      {{ headerText }}
    </template>
    <template #content>
      <span :class="$style.Content">{{ name ?? '???' }}</span>
    </template>
    <template
      v-if="pronouns"
      #subtitle
    >
      {{ pronouns }}
    </template>
  </CutOffBorderedElem>
</template>

<style module lang="scss">
.WrapperRemove {
  opacity: 0;
}

.Content {
  font-size: v-bind(nameFontSize);
  font-weight: 700;
}
</style>
