<script setup lang="ts">
import gsap from 'gsap';
import { computed, nextTick, ref, watch } from 'vue';
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

// Celebration that covers the total when it crosses a milestone/round number (sent from the extension).
const celebration = ref<{ amount: number, name: string | null } | null>(null);
const celebrationElem = ref<HTMLElement>();
let celebrationTl: gsap.core.Timeline | undefined;
nodecg.listenFor('omnibar_celebrate', async (data: { amount: number, name: string | null }) => {
  celebrationTl?.kill();
  celebration.value = data;
  await nextTick();
  if (!celebrationElem.value) return;
  celebrationTl = gsap.timeline({ onComplete: () => { celebration.value = null; } })
    .fromTo(
      celebrationElem.value,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.out' },
    )
    .from(celebrationElem.value.children, { y: 15, opacity: 0, duration: 0.4, stagger: 0.12 }, '-=0.2')
    .to(celebrationElem.value, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.6, ease: 'power3.in', delay: 7 });
});
</script>

<template>
  <div
    class="Flex"
    :class="$style.Wrapper"
  >
    <div :class="$style.Border" />
    <div :class="$style.LogoBackground" />
    <div
      class="Flex"
      :class="$style.Content"
    >
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
      <div
        v-if="celebration"
        ref="celebrationElem"
        class="FlexColumn"
        :class="$style.Celebration"
      >
        <div :class="$style.CelebrationHeader">
          {{ celebration.name ?? 'Thank you!' }}
        </div>
        <div :class="$style.CelebrationAmount">
          {{ formatCurrencyAmount(celebration.amount, true) }} raised!
        </div>
      </div>
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

.Content {
  position: relative;
  height: 100%;
}

.Celebration {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 3px); /* don't cover the border */
  height: 100%;
  box-sizing: border-box;
  padding: 0 25px 0 15px;
  background: linear-gradient(52deg, var(--theme-border-colour) 0%, #b7790b 140%);
  white-space: nowrap;
  overflow: hidden;
}

.CelebrationHeader {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.CelebrationAmount {
  font-size: 28px;
  font-weight: 800;
}
</style>
