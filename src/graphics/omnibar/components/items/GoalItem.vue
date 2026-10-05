<script setup lang="ts">
import { computed, ref } from 'vue';
import { trackerBids } from '../../../../browser_shared/replicants';
import { useStacked } from '../../../../browser_shared/stacked';
import { useTweenedNumber } from '../../../../browser_shared/tween';
import { formatCurrencyAmount } from '../../../../browser_shared/util';
import ProgressBar from '../../../_misc/components/incentives/ProgressBar.vue';
import ItemInfo from './ItemInfo.vue';
import ItemTag from './ItemTag.vue';

const props = defineProps<{ bidId: number }>();
const bid = computed(() => trackerBids?.data?.find((b) => b.id === props.bidId));
const total = useTweenedNumber(() => bid.value?.total ?? 0);
const goal = computed(() => bid.value?.goal ?? 0);
const met = computed(() => !!bid.value && goal.value > 0 && bid.value.total >= goal.value);
// If the name is too long to leave room for the bar, the bar moves underneath.
const visual = ref<HTMLElement>();
const stacked = useStacked(visual, () => bid.value?.name);
</script>

<template>
  <div
    v-if="bid"
    class="Flex"
  >
    <ItemTag text="Incentive" />
    <div :class="{ [$style.Body]: true, [$style.Stacked]: stacked }">
      <ItemInfo
        :class="$style.Info"
        :subtitle="bid.game"
        :title="bid.name"
        :inline="stacked"
      />
      <div
        v-if="goal > 0"
        ref="visual"
        :class="$style.Visual"
      >
        <ProgressBar
          :class="$style.Bar"
          :value="bid.total"
          :max="goal"
          :height="stacked ? '18px' : '26px'"
        />
      </div>
      <div :class="$style.Amount">
        <span :class="$style.Total">{{ formatCurrencyAmount(total, true) }}</span>
        <template v-if="goal > 0">
          / {{ formatCurrencyAmount(goal, true) }}
        </template>
      </div>
      <div
        v-if="goal > 0"
        :class="{ [$style.ToGo]: true, [$style.Met]: met }"
      >
        {{ met ? 'Met!' : `${formatCurrencyAmount(goal - bid.total, true)} to go` }}
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
  grid-template-columns: auto minmax(0, 1fr) auto auto;
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
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
}

.Total {
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

.Met {
  background: #f0b429;
  color: #011f39;
  &::after {
    display: none;
  }
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  50% { transform: scale(1.08); }
}
</style>
