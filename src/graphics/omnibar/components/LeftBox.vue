<script setup lang="ts">
import gsap from 'gsap';
import { computed, ref, watch } from 'vue';
import { donationTotal } from '../../../browser_shared/replicants';
import { formatCurrencyAmount } from '../../../browser_shared/util';

const total = ref<number | null>(null);
const totalStr = computed(() => formatCurrencyAmount(total.value ?? 0, true));
const tl = gsap.timeline();
const logoBgWidth = (() => {
  switch(nodecg.bundleConfig.theme) {
    case 'red':
      return '128px'; // width of RedLogo.png
    case 'green':
      return '144px'; // width of GreenLogo.png
    case 'blue':
      return '138px'; // width of BlueLogo.png
  }
})();

watch(() => donationTotal?.data, (val) => {
  if (typeof val === 'undefined') return;
  if (total.value === null) total.value = val;
  else tl.to(total, { value: val, duration: 5, delay: 1 });
}, { immediate: true });
</script>

<template>
  <div
    class="Flex"
    :class="$style.Wrapper"
  >
    <div :class="$style.Border" />
    <div :class="$style.LogoBackground" />
    <div :class="$style.Divider" />
    <img
      :class="$style.CrisisLogo"
      src="./CrisisLogo.png"
    >
    <div :class="$style.Divider" />
    <div :class="$style.Total">
      <!-- We split up each character into a span, so we can fake "monospace" them. -->
      <span
        v-for="(char, i) of totalStr"
        :key="i"
        :class="{ [$style.Comma]: char === ',' }"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  position: relative;
  height: 100%;
}

.Border {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #2f6f9d; /* Different colour than other borders! */
  clip-path: polygon(
    100% 0%,                            /* outside top right */
    100% calc(100% - 13px),             /* outside bottom right upper  */
    calc(100% - 13px) 100%,             /* outside bottom right lower */
    calc(100% - 18px) 100%,             /* inside bottom right lower */
    calc(100% - 3px) calc(100% - 15px), /* inside bottom right upper */
    calc(100% - 3px) 0%,                /* inside top right */
  );
}

/* This exists to actually take the space of the logo, which isn't actually inserted here. */
.LogoBackground {
  width: calc(v-bind('logoBgWidth') + 20px); /* Logo width + "padding" */
  height: 100%;
}

.Divider {
  background: white;
  width: 2px;
  height: 50%;
}

.CrisisLogo {
  padding: 0 20px;
}

.Total {
  font-size: 36px;
  font-weight: 700;
  padding: 0 23px 0 20px;
}

.Total > span {
  display: inline-block;
  text-align: center;
  width: 0.65em;
}

.Total > .Comma {
  width: 0.25em;
}
</style>
