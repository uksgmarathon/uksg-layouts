<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { gameLayouts, layoutSettings } from '../../browser_shared/replicants';
import type { Schemas } from '../../types';

useHead({ title: 'Game Layout Control' });
const selected = computed({
  get() {
    return gameLayouts?.data?.selected;
  },
  set(val) {
    if (gameLayouts?.data && typeof val !== 'undefined') {
      gameLayouts.data.selected = val;
      gameLayouts.save();
    }
  },
});
function setCelebrate(val: boolean) {
  if (!layoutSettings?.data) return;
  layoutSettings.data.celebrateFinish = val;
  layoutSettings.save();
}
function setOverEstimate(val: Schemas.LayoutSettings['overEstimate']) {
  if (!layoutSettings?.data) return;
  layoutSettings.data.overEstimate = val;
  layoutSettings.save();
}
const overEstimateOptions = [
  { label: 'Off', value: 'off' },
  { label: 'Time over', value: 'diff' },
  { label: 'Warning chip', value: 'chip' },
];
</script>

<template>
  <div>
    <template v-if="!gameLayouts?.data">
      Loading...
    </template>
    <template v-else>
      <QOptionGroup
        v-model="selected"
        :options="gameLayouts.data.available.map(({ name, code }) => ({ label: name, value: code }))"
        dense
      />
      <QSeparator class="q-my-sm" />
      <div
        v-if="layoutSettings?.data"
        class="column q-gutter-y-xs"
      >
        <QToggle
          :model-value="layoutSettings.data.celebrateFinish"
          label="Confetti when the timer finishes"
          dense
          @update:model-value="setCelebrate"
        />
        <div class="q-mt-sm">
          When the run goes over estimate:
        </div>
        <QBtnToggle
          :model-value="layoutSettings.data.overEstimate"
          :options="overEstimateOptions"
          toggle-color="primary"
          spread
          dense
          no-caps
          unelevated
          @update:model-value="setOverEstimate"
        />
        <div class="text-caption text-grey-5">
          These go back to off whenever the run changes.
        </div>
      </div>
    </template>
  </div>
</template>
