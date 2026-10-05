<script setup lang="ts">
import { computed } from 'vue';
import { omnibar } from '../../../browser_shared/replicants';
import BidWarItem from './items/BidWarItem.vue';
import DonationItem from './items/DonationItem.vue';
import DonationListItem from './items/DonationListItem.vue';
import GoalItem from './items/GoalItem.vue';
import MessageItem from './items/MessageItem.vue';
import MilestoneItem from './items/MilestoneItem.vue';
import RunItem from './items/RunItem.vue';
import UpcomingRunsItem from './items/UpcomingRunsItem.vue';

/**
 * The rotating centre section of the omnibar; what is shown is controlled by the extension
 * (see src/extension/omnibar.ts), including anything a host has "forced".
 */
const item = computed(() => omnibar?.data?.current ?? null);
const key = computed(() => (item.value ? `${item.value.type}_${item.value.id ?? ''}` : 'none'));
</script>

<template>
  <div :class="$style.Wrapper">
    <Transition name="item">
      <UpcomingRunsItem
        v-if="item?.type === 'upcomingRuns'"
        :key="key"
        :class="$style.Item"
      />
      <RunItem
        v-else-if="item?.type === 'run'"
        :key="key"
        :class="$style.Item"
        :run-id="String(item.id)"
      />
      <GoalItem
        v-else-if="item?.type === 'goal'"
        :key="key"
        :class="$style.Item"
        :bid-id="Number(item.id)"
      />
      <BidWarItem
        v-else-if="item?.type === 'bidWar'"
        :key="key"
        :class="$style.Item"
        :bid-id="Number(item.id)"
      />
      <MilestoneItem
        v-else-if="item?.type === 'milestone'"
        :key="key"
        :class="$style.Item"
        :milestone-id="String(item.id)"
      />
      <MessageItem
        v-else-if="item?.type === 'message'"
        :key="key"
        :class="$style.Item"
        :message-id="String(item.id)"
      />
      <DonationListItem
        v-else-if="item?.type === 'donationList'"
        :key="key"
        :class="$style.Item"
      />
      <DonationItem
        v-else-if="item?.type === 'donation'"
        :key="key"
        :class="$style.Item"
        :donation-id="Number(item.id)"
      />
    </Transition>
  </div>
</template>

<style lang="css" scoped>
/* New items slide up from below as the old ones slide up and out. */
.item-enter-active, .item-leave-active {
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.6s ease;
}
.item-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.item-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>

<style lang="scss" module>
.Wrapper {
  position: relative;
  flex: 1;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.Item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 25px 0 15px;
  justify-content: flex-start;
}
</style>
