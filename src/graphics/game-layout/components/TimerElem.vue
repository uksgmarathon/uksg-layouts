<script setup lang="ts">
withDefaults(defineProps<{
  vertical?: boolean,
}>(), {
  vertical: false,
});
</script>

<template>
  <div
    class="Fixed Flex"
    :class="{
      [$style.Wrapper]: true,
      [$style.WrapperVertical]: vertical,
    }"
  >
    <div
      class="Flex"
      :class="{
        [$style.Estimate]: true,
        [$style.EstimateVertical]: vertical,
      }"
    >
      EST: 00:00:00
    </div>
    <div
      :class="{
        [$style.Timer]: true,
        [$style.TimerVertical]: vertical,
      }"
    >
      00:00:00
    </div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  justify-content: space-evenly;
}

.WrapperVertical {
  flex-direction: column;
  padding: 5px;
}

.Estimate {
  font-size: 16px;
  padding: 10px 30px;
  background: linear-gradient(270deg, #0d3354 10%, #13436f 99%);
  font-weight: 600;
  clip-path: polygon(0 0, calc(100% - 20px) 0%, 100% 15px, 100% 100%, 15px 100%, 0% calc(100% - 15px));
}

.EstimateVertical {
  width: 100%;
  box-sizing: border-box;
  font-size: 22px;
  background: linear-gradient(44deg, #0f375a 0%, #062743 100%);
}

.Timer {
  font-size: 60px;
  font-weight: 700;
  margin-top: 0.1em;
}

.TimerVertical {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 80px;
}
</style>
