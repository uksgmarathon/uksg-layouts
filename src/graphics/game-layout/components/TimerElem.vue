<script setup lang="ts">
</script>

<template>
  <div class="Fixed Flex" :class="$style.Wrapper">
    <div :class="$style.Estimate">EST: 00:00:00</div>
    <div :class="$style.Timer">00:00:00</div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  justify-content: space-evenly;
}

.Estimate {
  font-size: 16px;
  padding: 10px 30px;
  background: linear-gradient(270deg, #0d3354 10%, #13436f 99%);
  font-weight: 600;
  clip-path: polygon(0 0, calc(100% - 20px) 0%, 100% 15px, 100% 100%, 15px 100%, 0% calc(100% - 15px));
}

.Timer {
  font-size: 60px;
  font-weight: 700;
  margin-top: 0.1em;
}
</style>
