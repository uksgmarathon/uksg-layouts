<script setup lang="ts">
import CutOffBorderedElem from '../../_misc/components/CutOffBorderedElem.vue';

withDefaults(defineProps<{
  headerColour?: string,
  headerText?: string,
  headerFontSize?: string,
  headerWidth?: string,
  nameFontSize?: string,
  cutEdgeSize?: string,
}>(), {
  headerText: 'Runner',
  headerFontSize: '20px',
  nameFontSize: '26px',
  cutEdgeSize: '15px',
});
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
      <span :class="$style.Name">RunnerName</span>
    </template>
    <template v-slot:subtitle>they/them</template>
  </CutOffBorderedElem>
</template>

<style module lang="scss">
.Content {
  font-size: v-bind(nameFontSize);
  font-weight: 700;
}
</style>
