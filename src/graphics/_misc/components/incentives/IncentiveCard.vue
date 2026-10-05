<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useTweenedNumber } from '../../../../browser_shared/tween';
import { formatCurrencyAmount } from '../../../../browser_shared/util';
import type { Schemas } from '../../../../types';
import OptionBars from './OptionBars.vue';
import ProgressBar from './ProgressBar.vue';
import TugOfWar from './TugOfWar.vue';

/**
 * Larger incentive display that fills whatever space it's given; used in the game layout.
 * Shows less detail when there isn't much height available.
 */
const props = defineProps<{
  bid: Schemas.TrackerBids[0],
}>();

const elem = ref<HTMLElement>();
const height = ref(0);
const observer = new ResizeObserver(([entry]) => { height.value = entry.contentRect.height; });
onMounted(() => { if (elem.value) observer.observe(elem.value); });
onBeforeUnmount(() => observer.disconnect());
const compact = computed(() => height.value < 170);
const maxOptions = computed(() => Math.max(2, Math.floor((height.value - 90) / 38)));

const total = useTweenedNumber(() => props.bid.total);
const met = computed(() => !!props.bid.goal && props.bid.total >= props.bid.goal);
</script>

<template>
  <div
    ref="elem"
    class="FlexColumn"
    :class="{ [$style.Card]: true, [$style.Compact]: compact }"
  >
    <div :class="$style.Header">
      <span :class="$style.Tag">{{ bid.type === 'challenge' ? 'Incentive' : 'Bid War' }}</span>
      <span :class="$style.Name">{{ bid.name }}</span>
    </div>
    <div
      v-if="!compact && bid.description && height > 260"
      :class="$style.Description"
    >
      {{ bid.description }}
    </div>
    <div :class="$style.Visual">
      <template v-if="bid.type === 'challenge'">
        <ProgressBar
          v-if="bid.goal"
          :value="bid.total"
          :max="bid.goal"
          :height="compact ? '20px' : '28px'"
        />
        <div :class="$style.Amounts">
          <span>
            <span :class="$style.Total">{{ formatCurrencyAmount(total, true) }}</span>
            <template v-if="bid.goal"> / {{ formatCurrencyAmount(bid.goal, true) }}</template>
          </span>
          <span
            v-if="bid.goal"
            :class="{ [$style.ToGo]: true, [$style.Met]: met }"
          >
            {{ met ? 'Met!' : `${formatCurrencyAmount(bid.goal - bid.total, true)} to go` }}
          </span>
        </div>
      </template>
      <TugOfWar
        v-else-if="bid.options.length === 2"
        :options="bid.options"
        stacked
        :height="compact ? '20px' : '28px'"
        :font-size="compact ? '16px' : '19px'"
      />
      <OptionBars
        v-else
        :options="bid.options"
        :max="maxOptions"
        column
        :font-size="compact ? '15px' : '17px'"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../cut' as *;

.Card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  align-items: stretch;
  justify-content: center;
  gap: 12px;
  overflow: hidden;
}

.Header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
}

.Compact {
  gap: 8px;
  .Header {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  .Name {
    font-size: 20px;
  }
}

.Tag {
  flex: 0 0 auto;
  padding: 3px 10px;
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  background: var(--theme-border-colour);
  @include doubleCut(8px);
}

.Name {
  max-width: 100%;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.15;
}

.Description {
  font-size: 17px;
  font-weight: 500;
  color: #d6eaf8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.Amounts {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  font-size: 20px;
  font-weight: 600;
}

.Total {
  font-weight: 800;
  color: #f0b429;
}

.ToGo {
  padding: 2px 8px;
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
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
}
</style>
