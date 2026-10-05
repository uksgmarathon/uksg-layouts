<script setup lang="ts">
import { computed } from 'vue';
import { assetsRotationImages, imageRotation, layoutRotation, trackerBids } from '../../../browser_shared/replicants';
import IncentiveCard from './incentives/IncentiveCard.vue';

/**
 * If "incentives" is set, the current run's incentives will be shown in between images
 * (controlled by the extension, see src/extension/image-rotation.ts).
 */
const props = withDefaults(defineProps<{
  incentives?: boolean,
}>(), {
  incentives: false,
});

const imgSrc = computed(() => {
  return assetsRotationImages?.data?.find((a) => a.sum === imageRotation?.data?.sum)?.url;
});
const bid = computed(() => (props.incentives
  ? trackerBids?.data?.find((b) => b.id === layoutRotation?.data?.bidId)
  : undefined));
</script>

<template>
  <div :class="$style.Wrapper">
    <Transition name="fade">
      <IncentiveCard
        v-if="bid"
        :key="`bid_${bid.id}`"
        :class="$style.Image"
        :bid="bid"
      />
      <img
        v-else-if="imgSrc"
        :key="imgSrc"
        :class="$style.Image"
        :src="imgSrc"
      >
    </Transition>
  </div>
</template>

<style lang="css" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss" module>
.Wrapper {
  display: grid; /* allows children to overlap when set up correctly */
  padding: 20px;
  box-sizing: border-box;
}

.Image {
  grid-area: 1 / 1; /* allows us to overlap other siblings */
  width: 100%;
  height: 100%;
  object-fit: contain;
  overflow: auto; /* makes sure the 100% height actually contains the image */
}
</style>
