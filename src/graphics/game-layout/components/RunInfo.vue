<script setup lang="ts">
</script>

<template>
  <div class="Fixed">
    <div :class="$style.Border" />
    <div :class="$style.Inner">
      <div :class="$style.GameName">VideoGameNameHere</div>
      <div :class="$style.Subtitle">Category | Console, 1999</div>
    </div>
  </div>
</template>

<style lang="scss" module>
.Border {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--red-border-colour);
  clip-path: polygon(
    0% 0%,                             /* outside top left */
    0 calc(100% - 25px),               /* outside bottom left upper */
    25px 100%,                         /* outside bottom left lower */
    28px calc(100% - 3px),             /* inside bottom left lower */
    3px calc(100% - 28px),             /* inside bottom left upper */
    3px 3px,                           /* inside top left */
    calc(100% - 3px) 3px,              /* inside top right */
    calc(100% - 3px) calc(100% - 3px), /* inside bottom right */
    28px calc(100% - 3px),             /* inside bottom left lower [REPEAT] */
    25px 100%,                         /* outside bottom left lower [REPEAT] */
    100% 100%,                         /* outside bottom right */
    100% 0%                            /* outside top right */
  );
}

.Inner {
  width: 100%;
  height: 100%;
  background: var(--red-gradient);
  padding: 25px;
  box-sizing: border-box;
  clip-path: polygon(
    0% 0%,               /* outside top left */
    0 calc(100% - 25px), /* outside bottom left upper */
    25px 100%,           /* outside bottom left lower */
    100% 100%,           /* outside bottom right */
    100% 0%              /* outside top right */
  );
}

.GameName {
  font-size: 40px;
  font-weight: 700;
}

.Subtitle {
  font-size: 24px;
  padding-top: 15px;
  font-weight: 500;
}
</style>
