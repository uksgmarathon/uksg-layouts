<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { orderBy } from 'lodash-es';
import { computed, ref } from 'vue';
import { isMet } from '../../browser_shared/bids';
import { formatDonationAmount, formatDonationBid } from '../../browser_shared/donations';
import { useNow } from '../../browser_shared/now';
import { describeItem, forceItem, isPinned, releaseItem, type OmnibarItem } from '../../browser_shared/omnibar';
import {
  donationTotal,
  milestones,
  omnibar,
  omnibarMessages,
  runDataActiveRun,
  trackerBids,
  trackerDonations,
} from '../../browser_shared/replicants';
import { formatPlayers, formatStartsIn, useUpcomingRuns } from '../../browser_shared/upcoming';
import { formatCurrencyAmount, msToTimeStr } from '../../browser_shared/util';

useHead({ title: 'Host Control' });
const tab = ref('incentives');
const now = useNow(1000);
const upcoming = useUpcomingRuns();

const current = computed(() => omnibar?.data?.current ?? null);
const pinned = computed(() => omnibar?.data?.pinned ?? null);
const pinRemaining = computed(() => (pinned.value?.expiresTimestamp
  ? msToTimeStr(Math.max(0, pinned.value.expiresTimestamp - now.value)).replace(/^00:/, '')
  : null));

// Current run's incentives first, then the rest in schedule order, with met incentives last.
const bids = computed(() => orderBy(
  trackerBids?.data ?? [],
  [(b) => {
    if (b.runId && b.runId === runDataActiveRun?.data?.id) return 0;
    return isMet(b) ? 2 : 1;
  }],
));
const sortedMilestones = computed(() => orderBy(milestones?.data ?? [], (m) => m.amount));
const total = computed(() => donationTotal?.data ?? 0);

function timeAgo(timestamp: number) {
  const mins = Math.max(0, Math.floor((now.value - timestamp) / (60 * 1000)));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

function showBtnProps(type: OmnibarItem['type'], id: OmnibarItem['id'] = null) {
  const active = isPinned(pinned.value, type, id);
  return { color: active ? 'positive' : 'primary', label: active ? 'Showing' : 'Show', icon: active ? 'push_pin' : 'visibility' };
}

/**
 * Pressing "Show" on the item that's already pinned just restarts its timeout.
 */
function show(type: OmnibarItem['type'], id: OmnibarItem['id'] = null) {
  forceItem(type, id)?.catch(() => { /* item no longer exists, nothing to do */ });
}
</script>

<template>
  <div>
    <!-- What's on the omnibar right now -->
    <QCard
      flat
      bordered
      square
      :class="{ [$style.Now]: true, [$style.NowPinned]: !!pinned }"
    >
      <QCardSection>
        <div class="text-overline">
          On the omnibar now
        </div>
        <div class="text-h6">
          {{ describeItem(current) }}
        </div>
        <div
          v-if="pinned"
          class="q-mt-xs"
        >
          <QBadge
            color="positive"
            label="PINNED"
          />
          <span class="q-ml-sm">
            {{ pinRemaining ? `Goes back to rotating in ${pinRemaining}` : 'Until released' }}
          </span>
        </div>
        <div
          v-else
          class="q-mt-xs text-grey-5"
        >
          Rotating automatically
        </div>
      </QCardSection>
      <QCardActions v-if="pinned">
        <QBtn
          class="col"
          color="negative"
          icon="close"
          label="Release"
          size="lg"
          unelevated
          square
          @click="releaseItem()"
        />
        <QBtn
          class="col-4"
          color="dark"
          icon="restart_alt"
          label="Keep pinned"
          size="lg"
          unelevated
          square
          @click="show(pinned.item.type, pinned.item.id)"
        />
      </QCardActions>
    </QCard>

    <!-- Quick buttons -->
    <div class="row q-col-gutter-sm q-mt-xs">
      <div class="col">
        <QBtn
          class="full-width"
          v-bind="showBtnProps('upcomingRuns')"
          :label="`${showBtnProps('upcomingRuns').label}: Coming Up`"
          unelevated
          square
          @click="show('upcomingRuns')"
        />
      </div>
      <div class="col">
        <QBtn
          class="full-width"
          v-bind="showBtnProps('donationList')"
          :label="`${showBtnProps('donationList').label}: Donation List`"
          unelevated
          square
          @click="show('donationList')"
        />
      </div>
    </div>

    <QTabs
      v-model="tab"
      class="q-mt-sm"
      align="justify"
      dense
      no-caps
    >
      <QTab
        name="incentives"
        :label="`Incentives (${bids.length})`"
      />
      <QTab
        name="runs"
        label="Runs"
      />
      <QTab
        name="milestones"
        label="Milestones"
      />
      <QTab
        name="donations"
        label="Donations"
      />
      <QTab
        name="messages"
        label="Messages"
      />
    </QTabs>
    <QSeparator />

    <QTabPanels
      v-model="tab"
      class="bg-transparent"
      animated
    >
      <!-- Incentives -->
      <QTabPanel
        name="incentives"
        class="q-pa-none"
      >
        <div
          v-if="!bids.length"
          class="q-pa-md text-grey-5"
        >
          No open incentives.
        </div>
        <QList separator>
          <QItem
            v-for="bid in bids"
            :key="bid.id"
          >
            <QItemSection>
              <QItemLabel overline>
                {{ bid.game }}
                <QBadge
                  v-if="bid.runId && bid.runId === runDataActiveRun?.data?.id"
                  class="q-ml-xs"
                  color="accent"
                  label="THIS RUN"
                />
                <QBadge
                  v-if="isMet(bid)"
                  class="q-ml-xs"
                  color="positive"
                  label="MET"
                />
              </QItemLabel>
              <QItemLabel class="text-subtitle1 text-weight-bold">
                {{ bid.type === 'choice' ? 'Bid War: ' : '' }}{{ bid.name }}
              </QItemLabel>
              <template v-if="bid.type === 'challenge'">
                <QItemLabel caption>
                  {{ formatCurrencyAmount(bid.total) }}{{ bid.goal ? ` / ${formatCurrencyAmount(bid.goal)}` : '' }}
                  <span v-if="isMet(bid)"> · only shown if you press Show</span>
                </QItemLabel>
                <QLinearProgress
                  v-if="bid.goal"
                  class="q-mt-xs"
                  :value="Math.min(1, bid.total / bid.goal)"
                  color="primary"
                  track-color="grey-9"
                />
              </template>
              <QItemLabel
                v-else
                caption
              >
                <span
                  v-for="(option, i) in bid.options"
                  :key="option.id"
                >
                  {{ i > 0 ? ' · ' : '' }}<b v-if="i === 0">{{ option.name }} {{ formatCurrencyAmount(option.total) }}</b>
                  <template v-else>{{ option.name }} {{ formatCurrencyAmount(option.total) }}</template>
                </span>
                <span v-if="!bid.options.length">No options yet</span>
              </QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QBtn
                v-bind="showBtnProps(bid.type === 'challenge' ? 'goal' : 'bidWar', bid.id)"
                :disable="bid.type === 'choice' && !bid.options.length"
                unelevated
                square
                @click="show(bid.type === 'challenge' ? 'goal' : 'bidWar', bid.id)"
              />
            </QItemSection>
          </QItem>
        </QList>
      </QTabPanel>

      <!-- Runs -->
      <QTabPanel
        name="runs"
        class="q-pa-none"
      >
        <div
          v-if="!upcoming.length"
          class="q-pa-md text-grey-5"
        >
          No upcoming runs.
        </div>
        <QList separator>
          <QItem
            v-for="{ run, startsIn } in upcoming.slice(0, 15)"
            :key="run.id"
          >
            <QItemSection
              side
              class="text-weight-bold"
            >
              {{ formatStartsIn(startsIn) }}
            </QItemSection>
            <QItemSection>
              <QItemLabel class="text-weight-bold">
                {{ run.game }}
              </QItemLabel>
              <QItemLabel caption>
                {{ [run.category, formatPlayers(run)].filter(Boolean).join(' · ') }}
              </QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QBtn
                v-bind="showBtnProps('run', run.id)"
                unelevated
                square
                @click="show('run', run.id)"
              />
            </QItemSection>
          </QItem>
        </QList>
      </QTabPanel>

      <!-- Milestones -->
      <QTabPanel
        name="milestones"
        class="q-pa-none"
      >
        <div
          v-if="!sortedMilestones.length"
          class="q-pa-md text-grey-5"
        >
          No milestones set up (add them in the Omnibar Settings panel).
        </div>
        <QList separator>
          <QItem
            v-for="milestone in sortedMilestones"
            :key="milestone.id"
          >
            <QItemSection>
              <QItemLabel class="text-subtitle1 text-weight-bold">
                {{ formatCurrencyAmount(milestone.amount, true) }}: {{ milestone.name }}
                <QBadge
                  v-if="total >= milestone.amount"
                  class="q-ml-xs"
                  color="positive"
                  label="REACHED"
                />
              </QItemLabel>
              <QItemLabel caption>
                {{ milestone.description }}
                <template v-if="total < milestone.amount">
                  ({{ formatCurrencyAmount(milestone.amount - total, true) }} to go)
                </template>
              </QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QBtn
                v-bind="showBtnProps('milestone', milestone.id)"
                unelevated
                square
                @click="show('milestone', milestone.id)"
              />
            </QItemSection>
          </QItem>
        </QList>
      </QTabPanel>

      <!-- Donations -->
      <QTabPanel
        name="donations"
        class="q-pa-none"
      >
        <div class="q-pa-sm text-grey-5 text-italic">
          Only screened donations are listed. Shout-outs are never shown unless you press the button.
        </div>
        <QList separator>
          <QItem
            v-for="donation in trackerDonations?.data ?? []"
            :key="donation.id"
          >
            <QItemSection>
              <QItemLabel>
                <span class="text-weight-bold">{{ donation.name }}</span>
                <span class="text-amber q-ml-sm text-weight-bold">{{ formatDonationAmount(donation.amount) }}</span>
                <span class="text-grey-5 q-ml-sm">{{ timeAgo(donation.timestamp) }}</span>
              </QItemLabel>
              <QItemLabel
                v-for="bid in donation.bids"
                :key="bid.id"
                caption
              >
                → {{ formatDonationBid(bid) }}
              </QItemLabel>
              <QItemLabel
                v-if="donation.comment"
                class="q-mt-xs"
              >
                {{ donation.comment }}
              </QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QBtn
                v-bind="showBtnProps('donation', donation.id)"
                :label="isPinned(pinned, 'donation', donation.id) ? 'Showing' : 'Shout-out'"
                unelevated
                square
                @click="show('donation', donation.id)"
              />
            </QItemSection>
          </QItem>
        </QList>
      </QTabPanel>

      <!-- Messages -->
      <QTabPanel
        name="messages"
        class="q-pa-none"
      >
        <QList separator>
          <QItem
            v-for="message in omnibarMessages?.data ?? []"
            :key="message.id"
          >
            <QItemSection>
              <QItemLabel :class="{ 'text-grey-6': !message.enabled }">
                {{ message.text }}
              </QItemLabel>
              <QItemLabel
                v-if="!message.enabled"
                caption
              >
                Not in rotation
              </QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QBtn
                v-bind="showBtnProps('message', message.id)"
                :disable="!message.text.trim()"
                unelevated
                square
                @click="show('message', message.id)"
              />
            </QItemSection>
          </QItem>
        </QList>
      </QTabPanel>
    </QTabPanels>
  </div>
</template>

<style lang="scss" module>
/* Needs !important to override Quasar's dark card background. */
.Now {
  background: #1d2433 !important;
  transition: background 0.3s;
}

.NowPinned {
  background: #1e3a2a !important;
}
</style>
