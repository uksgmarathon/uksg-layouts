<script setup lang="ts">
/**
 * Block used at the start of most items; a small "subtitle" above a main title,
 * or next to it if "inline" is set. The title is never cut off.
 */
withDefaults(defineProps<{
  subtitle?: string,
  title: string,
  inline?: boolean,
}>(), {
  subtitle: undefined,
  inline: false,
});
</script>

<template>
  <div :class="{ [$style.Info]: true, [$style.Inline]: inline }">
    <div
      v-if="subtitle"
      :class="$style.Subtitle"
    >
      {{ subtitle }}
    </div>
    <div :class="$style.Title">
      {{ title }}
    </div>
  </div>
</template>

<style lang="scss" module>
.Info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  white-space: nowrap;
}

.Inline {
  flex-direction: row;
  align-items: baseline;
  gap: 12px;
  .Subtitle {
    padding-bottom: 0;
  }
  .Title {
    font-size: 22px;
  }
}

.Subtitle {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #8cc4ed;
  padding-bottom: 3px;
}

.Title {
  font-size: 24px;
  font-weight: 700;
}
</style>
