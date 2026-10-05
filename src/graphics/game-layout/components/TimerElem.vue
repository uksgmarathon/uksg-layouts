<script setup lang="ts">
import gsap from 'gsap';
import { computed, ref, watch } from 'vue';
import { layoutSettings, runDataActiveRun, timer } from '../../../browser_shared/replicants';
import { msToTimeStr } from '../../../browser_shared/util';
import ConfettiBurst from '../../_misc/components/ConfettiBurst.vue';
import ContentWarnings from '../../_misc/components/ContentWarnings.vue';

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

// Celebrate when the timer finishes (but not if it was already finished when the graphic loaded).
// Off unless turned on for the run on the dashboard (see the "Game Layout Control" panel).
const confetti = ref<InstanceType<typeof ConfettiBurst>>();
const timerElem = ref<HTMLElement>();
const celebrating = ref(false);
watch(() => timer?.data?.state, (val, oldVal) => {
  if (val !== 'finished' || !oldVal || oldVal === 'finished' || !layoutSettings?.data?.celebrateFinish) return;
  celebrating.value = true;
  confetti.value?.burst();
  if (timerElem.value) {
    gsap.fromTo(timerElem.value, { scale: 1 }, { scale: 1.12, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 });
  }
  window.setTimeout(() => { celebrating.value = false; }, 4000);
});

// How far over the estimate the run is, while it's going.
// Shown either as the time over or a simple chip, or not at all (see the "Game Layout Control" panel).
const overEstimateMode = computed(() => layoutSettings?.data?.overEstimate ?? 'off');
const overEstimate = computed(() => {
  const estimate = (runDataActiveRun?.data?.estimateS ?? 0) * 1000;
  const { state, milliseconds } = timer?.data ?? {};
  if (overEstimateMode.value === 'off' || !estimate) return null;
  if (state !== 'running' && state !== 'paused') return null;
  const over = (milliseconds ?? 0) - estimate;
  return over >= 1000 ? msToTimeStr(over) : null;
});
</script>

<template>
  <div
    class="Fixed Flex"
    :class="{
      [$style.Wrapper]: true,
      [$style.WrapperVertical]: vertical,
      [$style.Celebrating]: celebrating,
    }"
  >
    <div
      class="Flex"
      :class="{
        [$style.Estimate]: true,
        [$style.EstimateVertical]: vertical,
        [$style.EstimateOver]: !!overEstimate && overEstimateMode === 'diff',
      }"
    >
      <span><span :class="$style.EstimateHeader">EST:</span>&nbsp;{{ runDataActiveRun?.data?.estimate ?? '??:??:??' }}</span>
      <span
        v-if="overEstimate && overEstimateMode === 'diff'"
        :class="$style.OverBy"
      >+{{ overEstimate }}</span>
      <ContentWarnings
        v-if="overEstimate && overEstimateMode === 'chip'"
        :class="$style.OverChip"
        :warnings="['Over estimate']"
        font-size="15px"
      />
    </div>
    <div
      ref="timerElem"
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
    <ConfettiBurst ref="confetti" />
  </div>
</template>

<style lang="scss" module>
@use '../../_misc/cut' as *;

.Wrapper {
  justify-content: space-evenly;
}

/* Keeps the confetti above anything next to the timer while it's flying about. */
.Celebrating {
  z-index: 5;
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
  /* If there's not enough room for anything shown next to the estimate, it wraps underneath. */
  flex-wrap: wrap;
  column-gap: 14px;
  row-gap: 4px;
  min-width: 0;
  white-space: nowrap;
}

.EstimateHeader {
  color: var(--border-colour);
}

.EstimateVertical {
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(44deg, #0f375a 0%, #062743 100%);
}

/* The run has gone over its estimate. */
.EstimateOver {
  background: linear-gradient(270deg, #b7790b 0%, #f0b429 100%);
  color: #011f39;
  transition: background 0.5s;
  .EstimateHeader {
    color: inherit;
  }
}

.OverBy {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.OverChip {
  @include doubleCut(6px);
  flex-wrap: nowrap;
}

/* Red rather than the usual warning colour; the extra class makes sure it wins over ContentWarnings' own styles. */
.Estimate .OverChip {
  background: #d00c27;
  color: white;
}

.Timer {
  flex-shrink: 0;
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
