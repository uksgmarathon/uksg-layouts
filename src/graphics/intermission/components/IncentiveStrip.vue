<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { isMet } from '../../../browser_shared/bids';
import { trackerBids } from '../../../browser_shared/replicants';
import { useStacked } from '../../../browser_shared/stacked';
import { formatCurrencyAmount } from '../../../browser_shared/util';
import OptionBars from '../../_misc/components/incentives/OptionBars.vue';
import ProgressBar from '../../_misc/components/incentives/ProgressBar.vue';
import TugOfWar from '../../_misc/components/incentives/TugOfWar.vue';

/**
 * Compact strip showing the open incentives for a run; cycles through them if there's more than 1.
 */
const props = defineProps<{ runId: string }>();
const bids = computed(() => (trackerBids?.data ?? [])
  .filter((b) => b.runId === props.runId)
  .filter((b) => b.type === 'challenge' || b.options.length));
const index = ref(0);
const handle = window.setInterval(() => { index.value += 1; }, 10 * 1000);
onBeforeUnmount(() => window.clearInterval(handle));
const bid = computed(() => (bids.value.length ? bids.value[index.value % bids.value.length] : undefined));
// If the name is too long to leave room for the bar, the bar moves underneath.
const visual = ref<HTMLElement>();
const stacked = useStacked(visual, () => [bid.value?.id, bid.value?.options]);
</script>

<template>
  <div :class="$style.Wrapper">
    <Transition name="fade">
      <div
        v-if="bid"
        :key="bid.id"
        :class="{ [$style.Strip]: true, [$style.Stacked]: stacked }"
      >
        <span :class="$style.Tag">{{ bid.type === 'challenge' ? 'Incentive' : 'Bid War' }}</span>
        <span :class="$style.Name">{{ bid.name }}</span>
        <div
          ref="visual"
          :class="$style.Visual"
        >
          <ProgressBar
            v-if="bid.type === 'challenge' && bid.goal"
            :value="bid.total"
            :max="bid.goal"
            :height="stacked ? '16px' : '20px'"
          />
          <TugOfWar
            v-else-if="bid.options.length === 2"
            :options="bid.options"
            :height="stacked ? '16px' : '20px'"
            font-size="17px"
          />
          <OptionBars
            v-else-if="bid.type === 'choice'"
            :options="bid.options"
            :max="3"
            font-size="15px"
          />
        </div>
        <span
          v-if="bid.type === 'challenge'"
          :class="$style.Amount"
        >
          <span :class="$style.Total">{{ formatCurrencyAmount(bid.total, true) }}</span>
          <template v-if="bid.goal"> / {{ formatCurrencyAmount(bid.goal, true) }}</template>
          <span
            v-if="isMet(bid)"
            :class="$style.Met"
          >Met!</span>
        </span>
      </div>
    </Transition>
  </div>
</template>

<style lang="css" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" module>
@use '../../_misc/cut' as *;

.Wrapper {
  display: grid; /* allows the transitioning strips to overlap */
}

.Strip {
  grid-area: 1 / 1;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  grid-template-areas: 'tag name visual amount';
  align-items: center;
  column-gap: 16px;
  min-height: 44px;
  padding: 0 16px 0 0;
  background: rgba(1, 31, 57, 0.6);
  white-space: nowrap;
  @include doubleCut(12px);
}

.Stacked {
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'tag name amount'
    'tag visual visual';
  row-gap: 4px;
  padding: 6px 16px 8px 0;
}

.Tag {
  grid-area: tag;
  align-self: stretch;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  background: var(--border-colour);
  color: var(--dark-text-colour);
}

.Stacked .Tag {
  margin: -6px 0 -8px; /* still fill the full height when there's padding */
}

.Name {
  grid-area: name;
  font-size: 20px;
  font-weight: 700;
}

.Visual {
  grid-area: visual;
  min-width: 0;
  overflow: hidden;
}

.Visual > * {
  min-width: 160px;
}

.Amount {
  grid-area: amount;
  font-size: 18px;
  font-weight: 600;
}

.Total {
  font-weight: 800;
  color: #f0b429;
}

.Met {
  @include doubleCut(6px);
  display: inline-block;
  margin-left: 10px;
  padding: 2px 8px;
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  background: #f0b429;
  color: #011f39;
}
</style>
