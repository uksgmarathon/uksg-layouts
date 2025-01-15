<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { gameLayouts } from '../../browser_shared/replicants';

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
    </template>
  </div>
</template>
