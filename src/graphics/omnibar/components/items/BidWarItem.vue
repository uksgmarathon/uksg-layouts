<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMarquee } from '../../../../browser_shared/marquee';
import { trackerBids } from '../../../../browser_shared/replicants';
import { useStacked } from '../../../../browser_shared/stacked';
import OptionBars from '../../../_misc/components/incentives/OptionBars.vue';
import TugOfWar from '../../../_misc/components/incentives/TugOfWar.vue';
import ItemInfo from './ItemInfo.vue';
import ItemTag from './ItemTag.vue';

const props = defineProps<{ bidId: number }>();
const bid = computed(() => trackerBids?.data?.find((b) => b.id === props.bidId));
// If the names are too long to fit next to each other, the options move underneath,
// and if they still don't fit, they scroll across. The content is what's measured, as the
// scrolling moves it (which would otherwise change the measurement).
const visual = ref<HTMLElement>();
const visualContent = ref<HTMLElement>();
const stacked = useStacked(visualContent, () => [bid.value?.name, bid.value?.options]);
useMarquee(visual, visualContent);
</script>

<template>
  <div
    v-if="bid"
    class="Flex"
  >
    <ItemTag text="Bid War" />
    <div :class="{ [$style.Body]: true, [$style.Stacked]: stacked }">
      <ItemInfo
        :subtitle="bid.game"
        :title="bid.name"
        :inline="stacked"
      />
      <div
        ref="visual"
        :class="$style.Visual"
      >
        <div ref="visualContent">
          <TugOfWar
            v-if="bid.options.length === 2"
            :options="bid.options"
            :height="stacked ? '16px' : '26px'"
            font-size="18px"
          />
          <OptionBars
            v-else
            :options="bid.options"
            :font-size="stacked ? '16px' : '17px'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.Body {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  column-gap: 25px;
}

.Stacked {
  grid-template-columns: minmax(0, 1fr);
  row-gap: 6px;
}

.Visual {
  min-width: 0;
  overflow: hidden;
}
</style>
