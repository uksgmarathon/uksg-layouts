<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStacked } from '../../../../browser_shared/stacked';
import { formatCurrencyAmount } from '../../../../browser_shared/util';
import ProgressBar from '../../../_misc/components/incentives/ProgressBar.vue';
import ItemInfo from './ItemInfo.vue';
import ItemTag from './ItemTag.vue';

/**
 * Item with a progress bar towards a target and how much is left to go; used for incentive goals and milestones.
 * The amount shown next to the bar goes in the default slot. With no target (max 0), only the amount is shown.
 */
const props = defineProps<{
  tag: string,
  subtitle?: string,
  title: string,
  value: number,
  max: number,
  doneLabel: string,
}>();
const done = computed(() => props.max > 0 && props.value >= props.max);
// If the title is too long to leave room for the bar, the bar moves underneath.
const visual = ref<HTMLElement>();
const stacked = useStacked(visual, () => [props.title, props.subtitle]);
</script>

<template>
  <div class="Flex">
    <ItemTag :text="tag" />
    <div :class="{ [$style.Body]: true, [$style.Stacked]: stacked }">
      <ItemInfo
        :class="$style.Info"
        :subtitle="subtitle"
        :title="title"
        :inline="stacked"
      />
      <div
        v-if="max > 0"
        ref="visual"
        :class="$style.Visual"
      >
        <ProgressBar
          :class="$style.Bar"
          :value="value"
          :max="max"
          :height="stacked ? '18px' : '26px'"
        />
      </div>
      <div :class="$style.Amount">
        <slot />
      </div>
      <div
        v-if="max > 0"
        :class="{ [$style.ToGo]: true, [$style.Done]: done }"
      >
        <!-- Rounded up, so it never says "£0 to go" before the target is reached. -->
        {{ done ? doneLabel : `${formatCurrencyAmount(Math.ceil(max - value), true)} to go` }}
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
  white-space: nowrap;
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

.Done {
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
