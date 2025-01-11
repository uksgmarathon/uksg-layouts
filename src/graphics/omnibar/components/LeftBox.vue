<script setup lang="ts">
</script>

<template>
  <div class="Flex" :class="$style.Wrapper">
    <div :class="$style.LogoBackground" />
    <div :class="$style.Divider" />
    <img :class="$style.CrisisLogo" src="./CrisisLogo.png">
    <div :class="$style.Divider" />
    <div :class="$style.Total">£10,000</div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  background-color: #44a0e3;
  height: 100%;
  clip-path: polygon(
    0% 0%,                  /* outside top left */
    100% 0%,                /* outside top right */
    100% calc(100% - 15px), /* outside bottom right upper */
    calc(100% - 15px) 100%, /* outside bottom right lower */
    0% 100%                 /* outside bottom left */
  );
}

/* This exists to actually take the space of the logo, which isn't actually inserted here. */
.LogoBackground {
  width: calc(138px + 20px); /* Logo width + "padding" */
  height: 100%;
}

.Divider {
  background: white;
  width: 2px;
  height: 50%;
}

.CrisisLogo {
  padding: 0 20px;
}

.Total {
  font-size: 36px;
  font-weight: 700;
  color: #011f39;
  padding: 0 20px;
}
</style>
