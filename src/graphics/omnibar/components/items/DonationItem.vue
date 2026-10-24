<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatDonationAmount, getDonationColour } from '../../../../browser_shared/donations';
import { useMarquee } from '../../../../browser_shared/marquee';
import { trackerDonations } from '../../../../browser_shared/replicants';
import ItemTag from './ItemTag.vue';

/**
 * A single donation "shout-out"; these are only ever shown when a host chooses to.
 * Anything too long to fit (what it went towards, the comment) scrolls rather than being cut off.
 */
const props = defineProps<{ donationId: number }>();
const donation = computed(() => trackerDonations?.data?.find((d) => d.id === props.donationId));
const bidsContainer = ref<HTMLElement>();
const bidsContent = ref<HTMLElement>();
useMarquee(bidsContainer, bidsContent, 70);
const commentContainer = ref<HTMLElement>();
const commentContent = ref<HTMLElement>();
useMarquee(commentContainer, commentContent, 70);
</script>

<template>
  <div
    v-if="donation"
    class="Flex"
  >
    <ItemTag
      text="Donation"
      :colour="getDonationColour(donation.amount)"
    />
    <div
      class="FlexColumn"
      :class="$style.Body"
    >
      <div
        class="Flex"
        :class="$style.Top"
      >
        <span :class="$style.Name">{{ donation.name }}</span>
        <span :class="$style.Amount">{{ formatDonationAmount(donation.amount) }}</span>
        <div
          v-if="donation.bids.length"
          ref="bidsContainer"
          :class="$style.Bids"
        >
          <div
            ref="bidsContent"
            :class="$style.BidsContent"
          >
            <span
              v-for="bid in donation.bids"
              :key="bid.id"
              :class="$style.Bid"
            >
              <span :class="$style.Arrow">→</span>
              <span
                v-if="bid.game"
                :class="$style.BidGame"
              >{{ bid.game }}</span>
              <span>{{ bid.name }}</span>
              <span
                v-if="bid.option"
                :class="$style.BidOption"
              >{{ bid.option }}</span>
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="donation.comment"
        ref="commentContainer"
        :class="$style.Comment"
      >
        <div
          ref="commentContent"
          :class="$style.CommentText"
        >
          {{ donation.comment }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../../_misc/cut' as *;

.Body {
  flex: 1;
  min-width: 0;
  align-items: stretch;
}

.Top {
  justify-content: flex-start;
  gap: 14px;
  white-space: nowrap;
}

.Name {
  flex: 0 0 auto;
  font-size: 24px;
  font-weight: 700;
}

.Amount {
  flex: 0 0 auto;
  font-size: 24px;
  font-weight: 800;
  color: #f0b429;
}

.Bids {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.BidsContent {
  display: inline-flex;
  gap: 10px;
}

.Bid {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 10px;
  font-size: 17px;
  font-weight: 700;
  background: #043053;
  @include doubleCut(6px);
  @include doubleCutBorder(6px, 2px, #2f6f9d);
}

.Arrow {
  color: #8cc4ed;
}

.BidGame {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #8cc4ed;
}

.BidOption {
  color: #f0b429;
}

.Comment {
  padding-top: 4px;
  overflow: hidden;
}

.CommentText {
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
  color: #d6eaf8;
}
</style>
