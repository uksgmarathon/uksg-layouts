<script setup lang="ts">
withDefaults(defineProps<{
  next?: boolean,
}>(), {
  next: false,
});
</script>

<template>
  <div class="Fixed">
    <div
      :class="{
        [$style.Border]: true,
        [$style.BorderNext]: next,
      }"
    />
    <div
      class="FlexColumn"
      :class="{
        [$style.Inner]: true,
        [$style.InnerNext]: next,
      }"
    >
      <div
        class="Flex"
        :class="{
          [$style.Header]: true,
          [$style.HeaderNext]: next,
        }"
      >
        {{ next ? 'coming up next' : 'later' }}
      </div>
      <div class="FlexColumn" :class="$style.Content">
        <div :class="$style.Title">Sonic 1 Forever</div>
        <div :class="$style.Subtitle">cowboyknuckles | Estimate: 00:20.00</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.Border {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--border-colour);
  clip-path: polygon(
    0% 0%,
    0% calc(100% - 20px),
    20px 100%,
    23px calc(100% - 3px),
    3px calc(100% - 23px),
    3px 3px,
    calc(100% - 23px) 3px,
    calc(100% - 3px) 23px,
    calc(100% - 3px) calc(100% - 3px),
    20px calc(100% - 3px),
    20px 100%,
    100% 100%,
    100% 20px,
    calc(100% - 20px) 0%,
  );
}

.BorderNext {
  background: var(--red-border-colour);
}

.Inner {
  width: 100%;
  height: 100%;
  clip-path: polygon(
    0% 0%,
    0% calc(100% - 20px),
    20px 100%,
    100% 100%,
    100% 20px,
    calc(100% - 20px) 0%,
  );
  background: linear-gradient(25deg, rgba(1,35,61,0.63) 0%, rgba(1,35,61,0.8) 100%);
}

.InnerNext {
  background: var(--red-gradient);
}

.Header {
  color: var(--dark-text-colour);
  text-transform: uppercase;
  font-size: 24px;
  font-weight: 700;
  background: var(--border-colour);
  min-width: 365px;
  height: 45px;
  clip-path: polygon(0% 0%, 0% calc(100% - 15px), 15px 100%, calc(100% - 15px) 100%, 100% calc(100% - 15px), 100% 0%);
}

.HeaderNext {
  background: var(--red-border-colour);
  color: unset;
}

.Content {
  flex: 1;
  justify-content: space-evenly;
}

.Title {
  font-size: 40px;
  font-weight: 700;
}

.Subtitle {
  font-size: 24px;
  font-weight: 500;
}
</style>
