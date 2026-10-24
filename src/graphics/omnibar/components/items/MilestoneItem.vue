<script setup lang="ts">
import { computed } from 'vue';
import { donationTotal, milestones } from '../../../../browser_shared/replicants';
import { formatCurrencyAmount } from '../../../../browser_shared/util';
import ProgressItem from './ProgressItem.vue';

const props = defineProps<{ milestoneId: string }>();
const milestone = computed(() => milestones?.data?.find((m) => m.id === props.milestoneId));
</script>

<template>
  <ProgressItem
    v-if="milestone"
    tag="Milestone"
    :subtitle="milestone.description || undefined"
    :title="milestone.name"
    :value="donationTotal?.data ?? 0"
    :max="milestone.amount"
    done-label="Reached!"
  >
    <span :class="$style.Amount">{{ formatCurrencyAmount(milestone.amount, true) }}</span>
  </ProgressItem>
</template>

<style lang="scss" module>
.Amount {
  font-size: 24px;
  font-weight: 800;
  color: #f0b429;
}
</style>
