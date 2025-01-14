<script setup lang="ts">
import { runDataActiveRun, timer } from '../../../browser_shared/replicants';

withDefaults(defineProps<{
  vertical?: boolean,
  estimateSize?: string,
  timerSize?: string,
}>(), {
  vertical: false,
  estimateSize: '16px',
  timerSize: '60px',
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
      EST: {{ runDataActiveRun?.data?.estimate ?? '??:??:??' }}
    </div>
    <div
      :class="{
        [$style.Timer]: true,
        [$style.TimerVertical]: vertical,
      }"
    >
      {{ timer?.data?.time ?? '??:??:??' }}
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
  font-size: v-bind(estimateSize);
  padding: 10px 30px;
  background: linear-gradient(270deg, #0d3354 10%, #13436f 99%);
  font-weight: 600;
  clip-path: polygon(0 0, calc(100% - 20px) 0%, 100% 15px, 100% 100%, 15px 100%, 0% calc(100% - 15px));
}

.EstimateVertical {
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(44deg, #0f375a 0%, #062743 100%);
}

.Timer {
  font-size: v-bind(timerSize);
  font-weight: 700;
  margin-top: 0.1em;
}

.TimerVertical {
  flex: 1;
  display: flex;
  align-items: center;
}
</style>
