<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMarquee } from '../../../../browser_shared/marquee';
import { omnibarSettings } from '../../../../browser_shared/replicants';
import { formatPlayers, formatStartsIn, useUpcomingRuns } from '../../../../browser_shared/upcoming';
import ItemTag from './ItemTag.vue';

const upcoming = useUpcomingRuns();
const runs = computed(() => upcoming.value.slice(0, omnibarSettings?.data?.upcomingRunsCount ?? 3));
// Names are never cut off; if the runs don't all fit, they scroll across instead.
const container = ref<HTMLElement>();
const content = ref<HTMLElement>();
useMarquee(container, content, 100, 1300);
</script>

<template>
  <div class="Flex">
    <ItemTag text="Coming Up" />
    <div
      ref="container"
      :class="$style.Runs"
    >
      <div
        ref="content"
        :class="$style.RunsContent"
      >
        <div
          v-for="({ run, startsIn }, i) in runs"
          :key="run.id"
          class="Flex"
          :class="$style.Run"
          :style="{ animationDelay: `${0.3 + (i * 0.15)}s` }"
        >
          <div
            :class="{ [$style.Time]: true, [$style.TimeNext]: i === 0 }"
          >
            {{ formatStartsIn(startsIn) }}
          </div>
          <div :class="$style.Info">
            <div :class="$style.Game">
              {{ run.game }}
            </div>
            <div :class="$style.Sub">
              {{ [run.category, formatPlayers(run)].filter(Boolean).join(' · ') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../../_misc/cut' as *;

.Runs {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.RunsContent {
  display: inline-flex;
  align-items: center;
  gap: 30px;
}

.Run {
  flex: 0 0 auto;
  animation: slideIn 0.5s ease-out both;
}

.Time {
  flex: 0 0 auto;
  padding: 4px 8px;
  margin-right: 12px;
  font-size: 16px;
  font-weight: 800;
  background: #043053;
  @include doubleCut(6px);
  @include doubleCutBorder(6px, 2px, #2f6f9d);
}

.TimeNext {
  background: var(--theme-border-colour);
  &::after {
    display: none;
  }
}

.Info {
  white-space: nowrap;
}

.Game {
  font-size: 21px;
  font-weight: 700;
}

.Sub {
  padding-top: 2px;
  font-size: 14px;
  font-weight: 500;
  color: #8cc4ed;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
