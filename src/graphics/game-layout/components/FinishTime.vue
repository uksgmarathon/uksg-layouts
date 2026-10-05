<script setup lang="ts">
import { computed } from 'vue';
import { runDataActiveRun, timer } from '../../../browser_shared/replicants';

/**
 * In races, pops up over a team's game feed once speedcontrol has finished them, with their time
 * (highlighted for whoever finished first). Should be given the same position/size as the game feed it belongs to.
 */
const props = defineProps<{
  index: number,
}>();

const finish = computed(() => {
  const run = runDataActiveRun?.data;
  const team = run?.teams[props.index];
  if (!run || run.teams.length < 2 || !team) return undefined;
  const times = timer?.data?.teamFinishTimes ?? {};
  const result = times[team.id];
  if (!result) return undefined;
  if (result.state === 'forfeit') return { time: undefined, winner: false };
  // Only teams that completed count, not ones that forfeited.
  const winner = !run.teams
    .some((t) => times[t.id]?.state === 'completed' && times[t.id].milliseconds < result.milliseconds);
  return { time: result.time, winner };
});
</script>

<template>
  <div
    class="FlexColumn"
    :class="$style.Wrapper"
  >
    <Transition name="pop">
      <div
        v-if="finish"
        class="Flex"
        :class="{
          [$style.Finish]: true,
          [$style.Winner]: finish.winner,
        }"
      >
        <span
          v-if="!finish.time"
          :class="$style.Forfeit"
        >Forfeit</span>
        <span
          v-else
          :class="$style.Time"
        >
          <!-- We split up each character into a span, so we can fake "monospace" them. -->
          <span
            v-for="(char, i) of finish.time"
            :key="i"
            :class="{ [$style.Colon]: char === ':' }"
          >{{ char }}</span>
        </span>
      </div>
    </Transition>
  </div>
</template>

<style lang="css" scoped>
.pop-enter-active {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
}
.pop-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s;
}
.pop-enter-from, .pop-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
</style>

<style lang="scss" module>
@use '../../_misc/cut' as *;

.Wrapper {
  justify-content: flex-end;
  padding-bottom: 15px;
  box-sizing: border-box;
  pointer-events: none;
}

.Finish {
  padding: 5px 14px;
  background: rgba(4, 48, 83, 0.92);
  @include doubleCut(8px);
  @include doubleCutBorder(8px, 2px, var(--border-colour));
  white-space: nowrap;
}


.Forfeit {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
}

.Time {
  font-size: 24px;
  font-weight: 700;
}

.Time > span {
  display: inline-block;
  text-align: center;
  width: 0.7em;
}

.Time > .Colon {
  width: 0.25em;
}

.Winner {
  background: #f0b429;
  color: #011f39;
  &::after {
    display: none;
  }
}
</style>
