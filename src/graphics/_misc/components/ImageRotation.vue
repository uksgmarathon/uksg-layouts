<script setup lang="ts">
import { computed } from 'vue';
import { assetsRotationImages, imageRotation } from '../../../browser_shared/replicants';

const imgSrc = computed(() => {
  return assetsRotationImages?.data?.find((a) => a.sum === imageRotation?.data?.sum)?.url;
});
</script>

<template>
  <div :class="$style.Wrapper">
    <Transition name="fade">
      <img
        v-if="imgSrc"
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
