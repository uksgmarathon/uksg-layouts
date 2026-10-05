<script setup lang="ts">
import { orderBy } from 'lodash-es';
import { computed } from 'vue';
import { formatCurrencyAmount } from '../../../../browser_shared/util';
import { useTweenedNumber } from '../../../../browser_shared/tween';

/**
 * Two option bid war, shown as a "tug-of-war" bar where each side pushes towards the other.
 */
const props = withDefaults(defineProps<{
  options: { id: number, name: string, total: number }[],
  stacked?: boolean,
  height?: string,
  fontSize?: string,
}>(), {
  stacked: false,
  height: '24px',
  fontSize: '20px',
});

// Order by ID so each option stays on the same side even when the lead changes.
const sides = computed(() => orderBy(props.options.slice(0, 2), (o) => o.id));
const split = computed(() => {
  const [left, right] = sides.value;
  const total = (left?.total ?? 0) + (right?.total ?? 0);
  return total > 0 ? ((left?.total ?? 0) / total) * 100 : 50;
});
// Starts in the middle and is "pulled" to the correct place.
const tweenedSplit = useTweenedNumber(() => split.value - 50, 2);
const leftPct = computed(() => 50 + tweenedSplit.value);
const leftTotal = useTweenedNumber(() => sides.value[0]?.total ?? 0);
const rightTotal = useTweenedNumber(() => sides.value[1]?.total ?? 0);
const leader = computed(() => {
  const [left, right] = sides.value;
  if (!left || !right || left.total === right.total) return null;
  return left.total > right.total ? 'left' : 'right';
});
</script>

<template>
  <div
    :class="{ [$style.Wrapper]: true, [$style.Stacked]: stacked }"
    :style="{ fontSize }"
  >
    <div
      :class="{ [$style.Label]: true, [$style.Leading]: leader === 'left' }"
    >
      <span :class="$style.Name">{{ sides[0]?.name }}</span>
      <span :class="$style.Amount">{{ formatCurrencyAmount(leftTotal, true) }}</span>
    </div>
    <div :class="$style.Bar">
      <div
        :class="$style.Left"
        :style="{ width: `${leftPct}%` }"
      />
      <div :class="$style.Right" />
      <div
        :class="$style.Marker"
        :style="{ left: `${leftPct}%` }"
      />
    </div>
    <div
      :class="{ [$style.Label]: true, [$style.LabelRight]: true, [$style.Leading]: leader === 'right' }"
    >
      <span :class="$style.Amount">{{ formatCurrencyAmount(rightTotal, true) }}</span>
      <span :class="$style.Name">{{ sides[1]?.name }}</span>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../cut' as *;

.Wrapper {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 15px;
  width: 100%;
}

/* Labels sit above the bar on either side. */
.Stacked {
  grid-template-columns: 1fr 1fr;
  row-gap: 6px;
  .Bar {
    grid-column: 1 / 3;
    grid-row: 2;
  }
  .LabelRight {
    justify-content: flex-end;
    text-align: right;
  }
  /* Names can wrap onto more lines when stacked, so they're never cut off. */
  .Label {
    white-space: normal;
  }
}

.Label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
  font-weight: 600;
  opacity: 0.75;
  transition: opacity 0.5s;
}

.Leading {
  opacity: 1;
  .Name {
    font-weight: 800;
  }
}

.Name {
  text-transform: uppercase;
}

.Amount {
  font-weight: 700;
  color: #f0b429;
}

.Bar {
  position: relative;
  height: v-bind(height);
  min-width: 100px;
  @include doubleCut(8px);
}

.Left, .Right {
  position: absolute;
  top: 0;
  height: 100%;
}

.Left {
  z-index: 1;
  left: 0;
  background: linear-gradient(90deg, var(--theme-border-colour) 60%, #44a0e3 100%);
}

.Right {
  right: 0;
  width: 100%;
  background: linear-gradient(270deg, #b7790b 0%, #f0b429 100%);
}

/* The "knot" in the middle of the rope. */
.Marker {
  position: absolute;
  z-index: 2;
  top: -2px;
  width: 6px;
  height: calc(100% + 4px);
  margin-left: -3px;
  background: white;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}
</style>
