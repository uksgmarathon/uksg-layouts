<script setup lang="ts">
import { computed } from 'vue';
import { getTextColour } from '../../../../browser_shared/customisation';
import { formatDonationAmount, getDonationColour } from '../../../../browser_shared/donations';
import { omnibarSettings, trackerDonations } from '../../../../browser_shared/replicants';
import ItemTag from './ItemTag.vue';

const donations = computed(() => (trackerDonations?.data ?? [])
  .slice(0, omnibarSettings?.data?.donationListCount ?? 15)
  .map((d) => ({ ...d, colour: getDonationColour(d.amount) })));
</script>

<template>
  <div class="Flex">
    <ItemTag text="Donations" />
    <div
      class="Flex"
      :class="$style.List"
    >
      <div
        v-for="(donation, i) in donations"
        :key="donation.id"
        class="FlexColumn"
        :class="$style.Box"
        :style="{
          background: donation.colour,
          color: getTextColour(donation.colour),
          animationDelay: `${0.3 + (i * 0.12)}s`,
        }"
      >
        <div :class="$style.Name">
          {{ donation.name }}
        </div>
        <div :class="$style.Amount">
          {{ formatDonationAmount(donation.amount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../../_misc/cut' as *;

.List {
  flex: 1;
  min-width: 0;
  justify-content: flex-start;
  gap: 8px;
  overflow: hidden;
  /* Boxes run off the edge to show there's been more; fade them out as they go. */
  -webkit-mask-image: linear-gradient(to right, black calc(100% - 80px), transparent);
  mask-image: linear-gradient(to right, black calc(100% - 80px), transparent);
}

.Box {
  flex: 0 0 auto;
  min-width: 90px;
  height: 56px;
  padding: 0 24px;
  align-items: flex-start;
  white-space: nowrap;
  @include doubleCut(10px);
  animation: slideIn 0.5s ease-out both;
}

.Name {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
}

.Amount {
  font-size: 22px;
  font-weight: 800;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
