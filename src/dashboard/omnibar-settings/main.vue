<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { orderBy } from 'lodash-es';
import { ref } from 'vue';
import { itemTypeNames } from '../../browser_shared/omnibar';
import { milestones, omnibarMessages, omnibarSettings } from '../../browser_shared/replicants';
import type { Schemas } from '../../types';
import ColourInput from '../_misc/ColourInput.vue';
import { newId, useDraft } from '../_misc/draft';

useHead({ title: 'Omnibar Settings' });
const tab = ref('messages');
const currencySymbol = nodecg.bundleConfig.tracker.currencySymbol;

// Messages
const messages = useDraft(() => omnibarMessages?.data);
function saveMessages() {
  if (!omnibarMessages) return;
  omnibarMessages.data = messages.draft.value.filter((m) => m.text.trim());
  omnibarMessages.save();
  messages.revert();
}

// Milestones
const milestoneDraft = useDraft(() => milestones?.data);
function saveMilestones() {
  if (!milestones) return;
  milestones.data = orderBy(
    milestoneDraft.draft.value.filter((m) => m.name.trim() && m.amount > 0),
    (m) => m.amount,
  );
  milestones.save();
  milestoneDraft.revert();
}

// Donation colour tiers
const tiers = useDraft(() => omnibarSettings?.data?.donationTiers);
function saveTiers() {
  if (!omnibarSettings?.data) return;
  omnibarSettings.data.donationTiers = orderBy(tiers.draft.value.filter((t) => t.colour), (t) => t.amount);
  omnibarSettings.save();
  tiers.revert();
}

// Rotation settings are saved straight away.
type NumberSetting = 'itemDuration' | 'pinTimeout' | 'upcomingRunsCount' | 'donationListCount' | 'celebrationStep';
const numberSettings: { key: NumberSetting, label: string, hint: string }[] = [
  { key: 'itemDuration', label: 'Seconds per item', hint: 'How long each item in the rotation is shown for' },
  { key: 'pinTimeout', label: 'Auto-release (seconds)', hint: 'Forced items go back to rotating after this long; 0 = never' },
  { key: 'upcomingRunsCount', label: 'Upcoming runs shown', hint: 'Number of runs in the "Coming Up" item' },
  { key: 'donationListCount', label: 'Donations in list', hint: 'Maximum number of boxes in the donation list' },
  { key: 'celebrationStep', label: 'Celebrate every (amount)', hint: 'Celebrate when the total passes a multiple of this; 0 = off (milestones always celebrate)' },
];
function setNumber(key: NumberSetting, val: string | number | null) {
  const num = Number(val);
  if (!omnibarSettings?.data || Number.isNaN(num) || num < 0) return;
  omnibarSettings.data[key] = num;
  omnibarSettings.save();
}
const rotationTypes: (keyof Schemas.OmnibarSettings['types'])[] = [
  'upcomingRuns', 'goal', 'bidWar', 'milestone', 'message', 'donationList',
];
function setType(type: keyof Schemas.OmnibarSettings['types'], val: boolean) {
  if (!omnibarSettings?.data) return;
  omnibarSettings.data.types[type] = val;
  omnibarSettings.save();
}
</script>

<template>
  <div>
    <QTabs
      v-model="tab"
      align="justify"
      dense
      no-caps
    >
      <QTab
        name="messages"
        label="Messages"
      />
      <QTab
        name="milestones"
        label="Milestones"
      />
      <QTab
        name="rotation"
        label="Rotation"
      />
      <QTab
        name="colours"
        label="Donation Colours"
      />
    </QTabs>
    <QSeparator />
    <QTabPanels
      v-model="tab"
      class="bg-transparent"
    >
      <!-- Messages -->
      <QTabPanel
        name="messages"
        class="q-px-none"
      >
        <div
          v-for="(message, i) in messages.draft.value"
          :key="message.id"
          class="row items-center no-wrap q-mb-sm"
        >
          <QToggle
            v-model="message.enabled"
            dense
          >
            <QTooltip>Include in rotation</QTooltip>
          </QToggle>
          <QInput
            v-model="message.text"
            class="col q-mx-sm"
            dense
            square
            outlined
            autogrow
          />
          <QBtn
            icon="delete"
            color="negative"
            flat
            dense
            @click="messages.draft.value.splice(i, 1)"
          />
        </div>
        <QBtn
          class="full-width"
          icon="add"
          label="Add message"
          color="dark"
          unelevated
          square
          @click="messages.draft.value.push({ id: newId(), text: '', enabled: true })"
        />
        <div class="row q-col-gutter-sm q-mt-xs">
          <div class="col">
            <QBtn
              class="full-width"
              label="Save"
              color="primary"
              :disable="!messages.dirty.value"
              unelevated
              square
              @click="saveMessages"
            />
          </div>
          <div class="col-4">
            <QBtn
              class="full-width"
              label="Revert"
              color="secondary"
              :disable="!messages.dirty.value"
              unelevated
              square
              @click="messages.revert"
            />
          </div>
        </div>
      </QTabPanel>

      <!-- Milestones -->
      <QTabPanel
        name="milestones"
        class="q-px-none"
      >
        <div
          v-for="(milestone, i) in milestoneDraft.draft.value"
          :key="milestone.id"
          class="q-mb-md"
        >
          <div class="row items-center no-wrap">
            <QInput
              v-model.number="milestone.amount"
              class="col-3"
              type="number"
              label="Amount"
              :prefix="currencySymbol"
              dense
              square
              outlined
            />
            <QInput
              v-model="milestone.name"
              class="col q-mx-sm"
              label="Name"
              dense
              square
              outlined
            />
            <QBtn
              icon="delete"
              color="negative"
              flat
              dense
              @click="milestoneDraft.draft.value.splice(i, 1)"
            />
          </div>
          <QInput
            v-model="milestone.description"
            class="q-mt-xs"
            label="Description (optional)"
            dense
            square
            outlined
          />
        </div>
        <QBtn
          class="full-width"
          icon="add"
          label="Add milestone"
          color="dark"
          unelevated
          square
          @click="milestoneDraft.draft.value.push({ id: newId(), amount: 0, name: '', description: '' })"
        />
        <div class="row q-col-gutter-sm q-mt-xs">
          <div class="col">
            <QBtn
              class="full-width"
              label="Save"
              color="primary"
              :disable="!milestoneDraft.dirty.value"
              unelevated
              square
              @click="saveMilestones"
            />
          </div>
          <div class="col-4">
            <QBtn
              class="full-width"
              label="Revert"
              color="secondary"
              :disable="!milestoneDraft.dirty.value"
              unelevated
              square
              @click="milestoneDraft.revert"
            />
          </div>
        </div>
      </QTabPanel>

      <!-- Rotation -->
      <QTabPanel
        name="rotation"
        class="q-px-none"
      >
        <template v-if="omnibarSettings?.data">
          <QInput
            v-for="setting in numberSettings"
            :key="setting.key"
            class="q-mb-sm"
            :model-value="omnibarSettings.data[setting.key]"
            type="number"
            :label="setting.label"
            :hint="setting.hint"
            debounce="750"
            dense
            square
            outlined
            @update:model-value="(val) => setNumber(setting.key, val)"
          />
          <div class="q-mt-md text-weight-bold">
            Included in rotation
          </div>
          <div class="column">
            <QToggle
              v-for="type in rotationTypes"
              :key="type"
              :model-value="omnibarSettings.data.types[type]"
              :label="itemTypeNames[type]"
              @update:model-value="(val: boolean) => setType(type, val)"
            />
          </div>
        </template>
      </QTabPanel>

      <!-- Donation colour tiers -->
      <QTabPanel
        name="colours"
        class="q-px-none"
      >
        <div class="q-mb-sm text-italic">
          Donations in the omnibar donation list (and shout-outs) use the colour of the highest tier they reach.
        </div>
        <div
          v-for="(tier, i) in tiers.draft.value"
          :key="i"
          class="row no-wrap q-mb-md"
        >
          <QInput
            v-model.number="tier.amount"
            class="col-3"
            type="number"
            label="From"
            :prefix="currencySymbol"
            dense
            square
            outlined
          />
          <ColourInput
            v-model="tier.colour"
            class="col q-mx-sm"
            label="Colour"
          />
          <QBtn
            class="self-start"
            icon="delete"
            color="negative"
            flat
            dense
            @click="tiers.draft.value.splice(i, 1)"
          />
        </div>
        <QBtn
          class="full-width"
          icon="add"
          label="Add tier"
          color="dark"
          unelevated
          square
          @click="tiers.draft.value.push({ amount: 0, colour: '#2f6f9d' })"
        />
        <div class="row q-col-gutter-sm q-mt-xs">
          <div class="col">
            <QBtn
              class="full-width"
              label="Save"
              color="primary"
              :disable="!tiers.dirty.value"
              unelevated
              square
              @click="saveTiers"
            />
          </div>
          <div class="col-4">
            <QBtn
              class="full-width"
              label="Revert"
              color="secondary"
              :disable="!tiers.dirty.value"
              unelevated
              square
              @click="tiers.revert"
            />
          </div>
        </div>
      </QTabPanel>
    </QTabPanels>
  </div>
</template>
