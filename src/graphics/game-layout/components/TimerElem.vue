<script setup lang="ts">
import { ref, watch } from 'vue';
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

const timeStr = ref('00:00:00');

watch(() => timer?.data, (data) => {
  if (data) timeStr.value = data.time;
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
      class="Flex"
      :class="{
        [$style.Timer]: true,
        [$style.TimerVertical]: vertical,
      }"
    >
      <!-- We split up each character into a span, so we can fake "monospace" them. -->
      <span
        v-for="(char, i) of timeStr"
        :key="i"
        :class="{ [$style.Colon]: char === ':' }"
      >
        {{ char }}
      </span>
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

.Timer > span {
  display: inline-block;
  text-align: center;
  width: 0.7em;
}

.Timer > .Colon {
  width: 0.25em;
  margin-top: -0.07em;
}
</style>
