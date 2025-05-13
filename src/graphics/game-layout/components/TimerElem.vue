<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { runDataActiveRun, timer } from '../../../browser_shared/replicants';
import { msToTimeStr } from '../../../browser_shared/util';

withDefaults(defineProps<{
  vertical?: boolean,
  timerSize?: string,
}>(), {
  vertical: false,
  timerSize: '60px',
});

/**
 * Backup timer that takes over if the connection to the server is lost.
 * Based on the last timestamp that was received.
 * When the conneciton is restored, the server timer will recover and take over again.
 */
 function backupTimer() {
  backupTimerTO = window.setTimeout(() => backupTimer(), 200);
  if (timer?.data?.state === 'running') {
    const missedTime = Date.now() - timer.data.timestamp;
    const timeOffset = timer.data.milliseconds + missedTime;
    timeStr.value = msToTimeStr(timeOffset);
  }
}

let backupTimerTO: number | undefined;
const timeStr = ref('00:00:00');
const state = computed(() => timer?.data?.state || 'stopped');

// Use original timer to keep track of if we need to run the backup.
watch(() => timer?.data, (data) => {
  if (data) timeStr.value = data.time;
  // Backup timer (see above).
  window.clearTimeout(backupTimerTO);
  backupTimerTO = window.setTimeout(() => backupTimer(), 1000);
}, { immediate: true });
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
      <span :class="$style.EstimateHeader">EST:</span>&nbsp;{{ runDataActiveRun?.data?.estimate ?? '??:??:??' }}
    </div>
    <div
      class="Flex"
      :class="{
        [$style.Timer]: true,
        [$style.TimerVertical]: vertical,
        [$style[state]]: true,
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
  font-size: 24px;
  padding: 10px 30px;
  background: linear-gradient(270deg, #0d3354 10%, #13436f 99%);
  font-weight: 600;
  clip-path: polygon(0 0, calc(100% - 20px) 0%, 100% 15px, 100% 100%, 15px 100%, 0% calc(100% - 15px));
}

.EstimateHeader {
  color: var(--border-colour);
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

.Timer.stopped, .Timer.paused {
  opacity: 0.7;
}

.Timer.finished {
  color: var(--border-colour);
}
</style>
