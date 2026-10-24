<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { formatCurrencyAmount } from '../../../../browser_shared/util';

/**
 * Bid war with 3 or more options, shown as bars that "race" each other.
 * Each bar shows that option's share of the bid war's total.
 */
const props = withDefaults(defineProps<{
  options: { id: number, name: string, total: number }[],
  max?: number,
  column?: boolean,
  fontSize?: string,
}>(), {
  max: 4,
  column: false,
  fontSize: '17px',
});

const shown = computed(() => props.options.slice(0, props.max));
const hidden = computed(() => props.options.length - shown.value.length);
const total = computed(() => props.options.reduce((prev, o) => prev + o.total, 0));
const pct = (amount: number) => (total.value > 0 ? (amount / total.value) * 100 : 0);

// Bars start empty and grow in one after another (using the CSS transition).
const grown = ref(false);
onMounted(() => { window.setTimeout(() => { grown.value = true; }, 300); });
</script>

<template>
  <div
    :class="{ [$style.Wrapper]: true, [$style.Column]: column }"
    :style="{ fontSize }"
  >
    <div
      v-for="(option, i) in shown"
      :key="option.id"
      :class="{ [$style.Option]: true, [$style.Leading]: i === 0 && option.total > 0 }"
    >
      <div :class="$style.Text">
        <span :class="$style.Name">{{ option.name }}</span>
        <span :class="$style.Amount">{{ formatCurrencyAmount(option.total, true) }}</span>
      </div>
      <div :class="$style.Track">
        <div
          :class="$style.Bar"
          :style="{ width: grown ? `${pct(option.total)}%` : '0%', transitionDelay: `${i * 0.15}s` }"
        />
      </div>
    </div>
    <div
      v-if="hidden > 0"
      :class="$style.More"
    >
      +{{ hidden }} more
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../cut' as *;

.Wrapper {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
}

.Column {
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

/* Options share the space equally, but never get narrower than their text. */
.Option {
  flex: 1 1 0;
  min-width: max-content;
}

.Column .Option {
  min-width: 0;
}

.Text {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
  padding-bottom: 4px;
}

.Name {
  font-weight: 600;
  text-transform: uppercase;
}

/* In a column there's no room to grow sideways, so long names wrap instead. */
.Column .Text {
  white-space: normal;
}

.Column .Amount {
  white-space: nowrap;
}

.Amount {
  font-weight: 700;
  color: #f0b429;
}

.Track {
  @include doubleCut(3px);
  height: 8px;
  background: rgba(1, 31, 57, 0.7);
}

.Bar {
  height: 100%;
  background: #2f6f9d;
  transition: width 1.5s ease-out;
}

.Leading .Bar {
  background: var(--theme-border-colour);
}

.Leading .Name {
  font-weight: 800;
}

.More {
  flex: 0 0 auto;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.75;
  white-space: nowrap;
}
</style>
