<script setup lang="ts">
withDefaults(defineProps<{
  headerColour?: string,
  headerText?: string,
  headerFontSize?: string,
  headerWidth?: string,
  nameFontSize?: string,
  cutEdgeSize?: string,
}>(), {
  headerText: 'Runner',
  headerFontSize: '20px',
  nameFontSize: '26px',
  cutEdgeSize: '15px',
});
</script>

<template>
  <div class="Fixed">
    <div :class="$style.Border" />
    <div class="Flex" :class="$style.Wrapper">
      <div
        class="Flex"
        :class="{
          [$style.Header]: true,
          [$style.HeaderGradient]: !headerColour,
        }"
      >
        {{ headerText }}
      </div>
      <div :class="$style.Name">RunnerName</div>
    </div>
    <div :class="$style.Pronouns">they/them</div>
  </div>
</template>

<style module lang="scss">
@mixin clipPathBorder($size) {
  clip-path: polygon(
    0% 0%,                              /* outside top left */
    0 calc(100% - $size),               /* outside bottom left upper */
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

@mixin clipPathHeader($size) {
  clip-path: polygon(
    0% 0%,                            /* outside top left */
    0 calc(100% - calc($size - 2px)), /* outside bottom left upper */
    calc($size - 2px) 100%,           /* outside bottom left lower */
    100% 100%,                        /* outside bottom right */
    100% 0%                           /* outside top right */
  );
}

.Border {
  @include clipPathBorder(v-bind(cutEdgeSize));
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--border-colour);
}

.Wrapper {
  width: 100%;
  height: 100%;
  padding: calc(3px + 4px); /* Border + padding */
  box-sizing: border-box;
  justify-content: flex-start;
}

.Header {
  @include clipPathHeader(v-bind(cutEdgeSize));
  height: 100%;
  background: v-bind(headerColour);
  padding: 0 10px;
  font-size: v-bind(headerFontSize);
  text-transform: uppercase;
  width: v-bind(headerWidth);
  font-weight: 700;
  box-sizing: border-box;
}
/* Only used for "Runner"/player. */
.HeaderGradient {
  background: linear-gradient(33deg, #1b6ebb 0%, #348bd2 100%);
}

.Name {
  padding: 0 15px;
  font-size: v-bind(nameFontSize);
  font-weight: 700;
}

.Pronouns {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #043053;
  padding: 5px 10px 3px 10px;
  font-size: 14px;
  margin: calc(3px + 4px); /* Border + padding */
  text-transform: uppercase;
  font-weight: 500;
}
</style>
