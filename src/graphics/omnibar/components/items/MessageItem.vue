<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMarquee } from '../../../../browser_shared/marquee';
import { omnibarMessages } from '../../../../browser_shared/replicants';

const props = defineProps<{ messageId: string }>();
const message = computed(() => omnibarMessages?.data?.find((m) => m.id === props.messageId));
const container = ref<HTMLElement>();
const content = ref<HTMLElement>();
useMarquee(container, content);
</script>

<template>
  <div
    ref="container"
    class="Flex"
    :class="$style.Wrapper"
  >
    <div
      ref="content"
      :class="$style.Text"
    >
      {{ message?.text }}
    </div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  overflow: hidden;
  justify-content: flex-start;
}

/* Only centred if it fits; otherwise it scrolls from the start. */
.Text {
  margin: 0 auto;
  font-size: 26px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
