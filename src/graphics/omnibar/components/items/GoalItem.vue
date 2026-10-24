<script setup lang="ts">
import { computed } from 'vue';
import { trackerBids } from '../../../../browser_shared/replicants';
import { useTweenedNumber } from '../../../../browser_shared/tween';
import { formatCurrencyAmount } from '../../../../browser_shared/util';
import ProgressItem from './ProgressItem.vue';

const props = defineProps<{ bidId: number }>();
const bid = computed(() => trackerBids?.data?.find((b) => b.id === props.bidId));
const total = useTweenedNumber(() => bid.value?.total ?? 0);
</script>

<template>
  <ProgressItem
    v-if="bid"
    tag="Incentive"
    :subtitle="bid.game"
    :title="bid.name"
    :value="bid.total"
    :max="bid.goal ?? 0"
    done-label="Met!"
  >
    <span :class="$style.Amount">
      <span :class="$style.Total">{{ formatCurrencyAmount(total, true) }}</span>
      <template v-if="bid.goal">
        / {{ formatCurrencyAmount(bid.goal, true) }}
      </template>
    </span>
  </ProgressItem>
</template>

<style lang="scss" module>
.Amount {
  font-size: 22px;
  font-weight: 600;
}

.Total {
  font-weight: 800;
  color: #f0b429;
}
</style>
