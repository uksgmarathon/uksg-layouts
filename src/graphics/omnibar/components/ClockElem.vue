<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';

const time = ref('00:00');
const date = ref('1 Jan 1970');

function setTimeAndDate() {
  const current = dayjs().tz('Europe/London');
  time.value = current.format('HH:mm');
  date.value = current.format('DD MMM YYYY');
}

setTimeAndDate();
window.setInterval(setTimeAndDate, 1000);
</script>

<template>
  <div :class="$style.Wrapper">
    <div :class="$style.Border" />
    <div
      class="FlexColumn"
      :class="$style.Clock"
    >
      <div :class="$style.Time">
        {{ time }}
      </div>
      <div :class="$style.Date">
        {{ date }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  position: relative;
  height: 100%;
  width: 120px;
  white-space: nowrap;
}

.Border {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #2f6f9d; /* Different colour than other borders! */
  clip-path: polygon(
    0% 100%,  /* outside bottom left */
    0% 13px,  /* outside top left lower */
    13px 0%,  /* outside top left upper */
    18px 0%,  /* inside top left upper */
    3px 15px, /* inside top left lower */
    3px 100%, /* inside bottom left */
  );
}

.Clock {
  align-items: flex-end;
  padding: 0 15px 0 18px;
  height: 100%;
}

.Time {
  font-size: 24px;
  font-weight: 700;
}

.Date {
  padding-top: 5px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
}
</style>
