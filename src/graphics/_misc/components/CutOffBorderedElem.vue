<script setup lang="ts">
withDefaults(defineProps<{
  headerColour: string,
  headerFontSize?: string,
  headerWidth?: string,
  cutEdgeSize?: string,
}>(), {
  headerFontSize: '20px',
  headerWidth: undefined,
  cutEdgeSize: '15px',
});
</script>

<template>
  <div>
    <div :class="$style.Border" />
    <div
      class="Flex"
      :class="$style.Inner"
    >
      <div
        class="Flex"
        :class="$style.Header"
      >
        <slot name="header" />
      </div>
      <div :class="$style.Content">
        <slot name="content" />
      </div>
    </div>
    <div
      v-if="$slots.subtitle"
      :class="$style.Subtitle"
    >
      <slot name="subtitle" />
    </div>
  </div>
</template>

<style module lang="scss">
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

@mixin clipPathHeader($size) {
  clip-path: polygon(
    0% 0%,                             /* outside top left */
    0% calc(100% - calc($size - 2px)), /* outside bottom left upper */
    calc($size - 2px) 100%,            /* outside bottom left lower */
    100% 100%,                         /* outside bottom right */
    100% 0%                            /* outside top right */
  );
}

.Border {
  @include clipPathBorder(v-bind(cutEdgeSize));
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: var(--border-colour);
}

.Inner {
  width: 100%;
  height: 100%;
  padding: calc(3px + 4px); /* Border + padding */
  box-sizing: border-box;
  justify-content: flex-start;
  overflow: hidden;
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

.Content {
  padding: 0 15px;
  flex: 1;
}

.Subtitle {
  position: absolute;
  z-index: 1;
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
