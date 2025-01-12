<script setup lang="ts">
</script>

<template>
  <div :class="$style.Wrapper">
    <div :class="$style.Border" />
    <div class="FlexColumn" :class="$style.Clock">
      <div :class="$style.Time">12:03</div>
      <div :class="$style.Date">Jan 24 2024</div>
    </div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  height: 100%;
}

.Border {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #2f6f9d; /* Different colour than other borders! */
  clip-path: polygon(
    0% 100%,
    0% 13px,
    13px 0%,
    18px 0%,
    3px 15px,
    3px 100%,
  );
}

.Clock {
  align-items: flex-end;
  padding: 0 15px 0 18px;
  height: 100%;
}

.Time {
  font-size: 24px;
  font-weight: 700;
}

.Date {
  padding-top: 5px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
}
</style>
