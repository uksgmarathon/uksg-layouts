<script setup lang="ts">
import { computed, ref } from 'vue';
import { trackerBids } from '../../../../browser_shared/replicants';
import { useStacked } from '../../../../browser_shared/stacked';
import OptionBars from '../../../_misc/components/incentives/OptionBars.vue';
import TugOfWar from '../../../_misc/components/incentives/TugOfWar.vue';
import ItemInfo from './ItemInfo.vue';
import ItemTag from './ItemTag.vue';

const props = defineProps<{ bidId: number }>();
const bid = computed(() => trackerBids?.data?.find((b) => b.id === props.bidId));
// If the names are too long to fit next to each other, the options move underneath.
const visual = ref<HTMLElement>();
const stacked = useStacked(visual, () => [bid.value?.name, bid.value?.options]);
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
        <TugOfWar
          v-if="bid.options.length === 2"
          :options="bid.options"
          :height="stacked ? '16px' : '26px'"
          font-size="18px"
        />
        <OptionBars
          v-else
          :options="bid.options"
          :max="4"
          :font-size="stacked ? '16px' : '17px'"
        />
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
