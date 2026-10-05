<script setup lang="ts">
import { computed, ref } from 'vue';
import { donationTotal, milestones } from '../../../../browser_shared/replicants';
import { useStacked } from '../../../../browser_shared/stacked';
import { formatCurrencyAmount } from '../../../../browser_shared/util';
import ProgressBar from '../../../_misc/components/incentives/ProgressBar.vue';
import ItemInfo from './ItemInfo.vue';
import ItemTag from './ItemTag.vue';

const props = defineProps<{ milestoneId: string }>();
const milestone = computed(() => milestones?.data?.find((m) => m.id === props.milestoneId));
const total = computed(() => donationTotal?.data ?? 0);
const reached = computed(() => !!milestone.value && total.value >= milestone.value.amount);
// If the name is too long to leave room for the bar, the bar moves underneath.
const visual = ref<HTMLElement>();
const stacked = useStacked(visual, () => [milestone.value?.name, milestone.value?.description]);
</script>

<template>
  <div
    v-if="milestone"
    class="Flex"
  >
    <ItemTag text="Milestone" />
    <div :class="{ [$style.Body]: true, [$style.Stacked]: stacked }">
      <ItemInfo
        :class="$style.Info"
        :subtitle="milestone.description || undefined"
        :title="milestone.name"
        :inline="stacked"
      />
      <div
        ref="visual"
        :class="$style.Visual"
      >
        <ProgressBar
          :class="$style.Bar"
          :value="total"
          :max="milestone.amount"
          :height="stacked ? '18px' : '26px'"
        />
      </div>
      <div :class="$style.Amount">
        {{ formatCurrencyAmount(milestone.amount, true) }}
      </div>
      <div
        :class="{ [$style.ToGo]: true, [$style.Reached]: reached }"
      >
        {{ reached ? 'Reached!' : `${formatCurrencyAmount(milestone.amount - total, true)} to go` }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../../_misc/cut' as *;

.Body {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  grid-template-areas: 'info visual amount togo';
  align-items: center;
  column-gap: 20px;
}

.Stacked {
  grid-template-areas:
    'info . amount togo'
    'visual visual visual visual';
  row-gap: 8px;
}

.Info {
  grid-area: info;
}

.Visual {
  grid-area: visual;
  min-width: 0;
  overflow: hidden;
}

.Bar {
  min-width: 220px;
}

.Amount {
  grid-area: amount;
  font-size: 24px;
  font-weight: 800;
  color: #f0b429;
}

.ToGo {
  grid-area: togo;
  padding: 4px 10px;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  background: #043053;
  @include doubleCut(6px);
  @include doubleCutBorder(6px, 2px, #2f6f9d);
}

.Reached {
  background: #f0b429;
  color: #011f39;
  &::after {
    display: none;
  }
}
</style>
