<script setup lang="ts">
import { computed } from 'vue';
import { getAccentColour, getRunWarnings, hexToRgba } from '../../../browser_shared/customisation';
import { contentWarnings, runCustomisation, runDataActiveRun } from '../../../browser_shared/replicants';
import ContentWarnings from '../../_misc/components/ContentWarnings.vue';

withDefaults(defineProps<{
  nameFontSize?: string,
  subtitleFontSize?: string,
  flipped?: boolean,
  horizontal?: boolean,
}>(), {
  nameFontSize: '40px',
  subtitleFontSize: '24px',
  flipped: false,
  horizontal: false,
});

// Content warnings for the run are shown next to the category (see the "Run Customisation" panel).
const warnings = computed(() => getRunWarnings(runDataActiveRun?.data, contentWarnings?.data));
// The theme colours can be overridden per run (see the "Run Customisation" panel).
const accentStyle = computed(() => {
  const accent = getAccentColour(runDataActiveRun?.data, runCustomisation?.data);
  if (!accent) return undefined;
  const rgba = (alpha: number) => hexToRgba(accent, alpha);
  return {
    '--theme-border-colour': accent,
    '--theme-gradient': `linear-gradient(155deg, ${rgba(1)} 0%, ${rgba(1)} 10%, ${rgba(0.7)} 40%, ${rgba(0.3)} 80%)`,
  };
});
</script>

<template>
  <div
    class="Fixed"
    :style="accentStyle"
  >
    <div :class="{ [$style.Border]: true, [$style.BorderFlipped]: flipped }" />
    <div
      class="FlexColumn"
      :class="{
        [$style.Inner]: true,
        [$style.InnerFlipped]: flipped,
        [$style.InnerHorizontal]: horizontal
      }"
    >
      <div :class="$style.GameName">
        {{ runDataActiveRun?.data?.game ?? '???' }}
      </div>
      <div
        :class="{
          [$style.Subtitle]: true,
          [$style.SubtitleHorizontal]: horizontal
        }"
      >
        <span>
          {{ runDataActiveRun?.data?.category ?? '???' }}
          | {{ runDataActiveRun?.data?.system ?? '???' }}<template v-if="runDataActiveRun?.data?.release">
            {{ `, ${runDataActiveRun?.data?.release}` }}
          </template>
        </span>
        <ContentWarnings
          v-if="warnings.length"
          :class="$style.Warnings"
          :warnings="warnings"
          font-size="15px"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../_misc/cut' as *;

@mixin clipPathBorder($size) {
  clip-path: polygon(
    0% 0%,                              /* outside top left */
    0% calc(100% - $size),              /* outside bottom left upper */
    $size 100%,                         /* outside bottom left lower */
    calc($size + 3px) calc(100% - 3px), /* inside bottom left lower */
    3px calc(100% - calc($size + 3px)), /* inside bottom left upper */
    3px 3px,                            /* inside top left */
    calc(100% - 3px) 3px,               /* inside top right */
    calc(100% - 3px) calc(100% - 3px),  /* inside bottom right */
    calc($size + 3px) calc(100% - 3px), /* inside bottom left lower [REPEAT] */
    $size 100%,                         /* outside bottom left lower [REPEAT] */
    100% 100%,                          /* outside bottom right */
    100% 0%                             /* outside top right */
  );
}

/* These are identical but "flipped" is rotated 180 degrees. */
@mixin clipPathInner($size) {
  clip-path: polygon(
    0% 0%,                 /* outside top left */
    0% calc(100% - $size), /* outside bottom left upper */
    $size 100%,            /* outside bottom left lower */
    100% 100%,             /* outside bottom right */
    100% 0%                /* outside top right */
  );
}
@mixin clipPathInnerFlipped($size) {
  clip-path: polygon(
    100% 100%,
    100% $size,
    calc(100% - $size) 0%,
    0% 0%,
    0% 100%
  );
}

.Border {
  @include clipPathBorder(25px);
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--theme-border-colour);
}

.BorderFlipped {
  /* To "flip" the border, we can get away with an easy rotate, as it has no content. */
  transform: rotate(180deg);
}

.Inner {
  @include clipPathInner(25px);
  width: 100%;
  height: 100%;
  background: var(--theme-gradient);
  padding: 25px;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: space-between;
}

.InnerFlipped {
  /* For the inner, to "flip" it, we have to use a different clip path. */
  @include clipPathInnerFlipped(25px);
}

.InnerHorizontal {
  flex-direction: unset;
  align-items: center;
  padding: 0 40px 0 25px;
}

.GameName {
  font-size: v-bind(nameFontSize);
  font-weight: 700;
}

.Subtitle {
  font-size: v-bind(subtitleFontSize);
  padding-top: 15px;
  font-weight: 500;
}

.SubtitleHorizontal {
  padding-top: unset;
}

/* Sits after the category/system, or wraps underneath if there isn't room. */
.Subtitle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 15px;
  row-gap: 6px;
}

.Warnings {
  flex-wrap: nowrap;
  @include doubleCut(8px);
}
</style>
