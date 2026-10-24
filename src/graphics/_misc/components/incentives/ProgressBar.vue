<script setup lang="ts">
import { computed } from 'vue';
import { useTweenedNumber } from '../../../../browser_shared/tween';

const props = withDefaults(defineProps<{
  value: number,
  max: number,
  height?: string,
}>(), {
  height: '24px',
});

const pct = useTweenedNumber(() => (props.max > 0 ? Math.min(1, props.value / props.max) : 0) * 100);
const met = computed(() => props.max > 0 && props.value >= props.max);
</script>

<template>
  <div :class="$style.Track">
    <div
      :class="{ [$style.Fill]: true, [$style.Met]: met }"
      :style="{ width: `${pct}%` }"
    />
  </div>
</template>

<style lang="scss" module>
@use '../../cut' as *;

.Track {
  position: relative;
  height: v-bind(height);
  background: rgba(1, 31, 57, 0.7);
  overflow: hidden;
  @include doubleCut(8px);
  @include doubleCutBorder(8px, 2px, #2f6f9d);
}


.Fill {
  position: relative;
  height: 100%;
  background: var(--theme-border-colour);
  overflow: hidden;
}

/* A light "shine" that sweeps across the bar. */
.Fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -40%;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0) 100%);
  animation: shine 4s ease-in-out 1.5s infinite;
}

.Met {
  background: linear-gradient(90deg, #b7790b 0%, #f0b429 100%);
}

@keyframes shine {
  0% { left: -40%; }
  40%, 100% { left: 110%; }
}
</style>
