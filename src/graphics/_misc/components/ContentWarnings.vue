<script setup lang="ts">
/**
 * Content warnings for a run (e.g. "Flashing Lights"), shown as a warning coloured band.
 */
withDefaults(defineProps<{
  warnings: string[],
  fontSize?: string,
}>(), {
  fontSize: '16px',
});
</script>

<template>
  <div
    class="Flex"
    :class="$style.Warnings"
    :style="{ fontSize }"
  >
    <svg
      :class="$style.Icon"
      viewBox="0 0 24 24"
    >
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
    <span
      v-for="warning in warnings"
      :key="warning"
      :class="$style.Warning"
    >
      {{ warning }}
    </span>
  </div>
</template>

<style lang="scss" module>
.Warnings {
  flex-wrap: wrap;
  justify-content: flex-start;
  column-gap: 0.6em;
  row-gap: 2px;
  padding: 0.35em 0.75em;
  background: #f0b429;
  color: #011f39;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.Icon {
  flex: 0 0 auto;
  width: 1.3em;
  height: 1.3em;
  fill: currentColor;
}

.Warning {
  white-space: nowrap;
}

/* Separator between each warning. */
.Warning + .Warning::before {
  content: '·';
  margin-right: 0.6em;
}
</style>
