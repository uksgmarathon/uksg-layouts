<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed, ref } from 'vue';
import { countdown } from '../../browser_shared/replicants';
import { msToTimeStr } from '../../browser_shared/util';

useHead({ title: 'Countdown Control' });
const entry = ref('');
const currentCountdown = computed(() => {
  const seconds = Math.round((countdown?.data?.remaining ?? 0) / 1000);
  return msToTimeStr(seconds * 1000);
});

function change() {
  nodecg.sendMessage('countdownStart', entry.value);
  entry.value = '';
}
</script>

<template>
  <div>
    <div>Current Countdown: {{ currentCountdown }}</div>
    <QTime class="full-width" v-model="entry" format24h flat square />
    <QBtn class="full-width" @click="change" color="primary" unelevated square>Apply</QBtn>
  </div>
</template>
