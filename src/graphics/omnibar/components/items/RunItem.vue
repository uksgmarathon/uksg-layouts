<script setup lang="ts">
import { computed } from 'vue';
import { runDataArray } from '../../../../browser_shared/replicants';
import { formatPlayers, formatStartsIn, useUpcomingRuns } from '../../../../browser_shared/upcoming';
import ItemInfo from './ItemInfo.vue';
import ItemTag from './ItemTag.vue';

const props = defineProps<{ runId: string }>();
const upcoming = useUpcomingRuns();
const run = computed(() => runDataArray?.data?.find((r) => r.id === props.runId));
const startsIn = computed(() => upcoming.value.find((u) => u.run.id === props.runId)?.startsIn);
const startsInStr = computed(() => (startsIn.value !== undefined ? formatStartsIn(startsIn.value) : undefined));
</script>

<template>
  <div
    v-if="run"
    class="Flex"
  >
    <!-- How long until it starts sits under the tag, so it stays with it. -->
    <div
      class="FlexColumn"
      :class="$style.TagColumn"
    >
      <ItemTag
        :class="$style.Tag"
        :text="startsInStr === 'Next' ? 'Up Next' : 'Coming Up'"
      />
      <div
        v-if="startsInStr && startsInStr !== 'Next'"
        :class="$style.Time"
      >
        in {{ startsInStr }}
      </div>
    </div>
    <ItemInfo
      :subtitle="formatPlayers(run)"
      :class="$style.Info"
      :title="run.game ?? '???'"
    />
    <div :class="$style.Details">
      {{ [run.category, run.system, run.estimate ? `Est. ${run.estimate}` : undefined].filter(Boolean).join(' | ') }}
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../../_misc/cut' as *;

.TagColumn {
  flex: 0 0 auto;
  align-items: stretch;
  gap: 4px;
  margin-right: 22px;
}

.TagColumn .Tag {
  height: 36px;
  margin-right: 0;
}

.Info {
  margin-right: 25px;
}

.Details {
  flex: 1;
  min-width: 0;
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.Time {
  padding: 2px 8px;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
  background: #043053;
  @include doubleCut(6px);
  @include doubleCutBorder(6px, 2px, #2f6f9d);
}
</style>
