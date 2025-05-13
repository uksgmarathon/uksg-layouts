<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { runDataActiveRunSurrounding, runDataArray, upcomingRunId } from '../../browser_shared/replicants';

useHead({ title: 'Upcoming Run Control' });
const types: ['previous', 'current', 'next'] = ['previous', 'current', 'next'];

function forceUpcomingRun(id?: string) {
  nodecg.sendMessage('intermission_forceUpcomingRun', id);
}

function getRunStr(id: string) {
  const run = runDataArray?.data?.find((r) => r.id === id);
  if (run) {
    return [run.game ?? '???', run.category].filter(Boolean).join(' - ');
  }
  return '???';
}
</script>

<template>
  <div>
    <div class="text-italic">
      This should only need to be used if the automatically set one is incorrect!
    </div>
    <div class="q-mt-xs">
      Currently set: {{ upcomingRunId?.data ? getRunStr(upcomingRunId.data) : 'none' }}
    </div>
    <div>
      <template
        v-for="type of types"
        :key="type"
      >
        <QBtn
          v-if="runDataActiveRunSurrounding?.data?.[type]"
          class="full-width q-mt-xs"
          color="dark"
          @click="forceUpcomingRun(runDataActiveRunSurrounding?.data?.[type])"
        >
          Force to {{ type }} ({{ getRunStr(runDataActiveRunSurrounding.data?.[type]) }})
        </QBtn>
        <QBtn
          v-else
          class="full-width q-mt-xs"
          color="dark"
          disable
        >
          {{ type }} not available
        </QBtn>
      </template>
      <QBtn
        class="full-width q-mt-xs"
        color="dark"
        @click="forceUpcomingRun()"
      >
        Force to nothing
      </QBtn>
    </div>
  </div>
</template>
