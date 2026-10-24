<script setup lang="ts">
import { computed } from 'vue';
import { getTextColour } from '../../../../browser_shared/customisation';

const props = defineProps<{
  text: string,
  colour?: string,
}>();

const textColour = computed(() => (props.colour ? getTextColour(props.colour) : undefined));
</script>

<template>
  <div
    class="Flex"
    :class="$style.Tag"
    :style="{ background: colour, color: textColour }"
  >
    {{ text }}
  </div>
</template>

<style lang="scss" module>
@use '../../../_misc/cut' as *;

.Tag {
  flex: 0 0 auto;
  height: 44px;
  padding: 0 20px;
  margin-right: 22px;
  background: var(--theme-border-colour);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  @include doubleCut(12px);
}
</style>
