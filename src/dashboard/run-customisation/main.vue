<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed, ref } from 'vue';
import {
  getAccentColour,
  getPlayerCustomisation,
  getRunWarningIds,
  getTextColour,
} from '../../browser_shared/customisation';
import { contentWarnings, runCustomisation, runDataActiveRun, runDataArray } from '../../browser_shared/replicants';
import ColourInput from '../_misc/ColourInput.vue';
import { newId, useDraft } from '../_misc/draft';

useHead({ title: 'Run Customisation' });
type PlayerKey = 'badgeColour' | 'badgeLabel' | 'feedColour';

// Follows the active run unless a different one is picked.
const pickedRunId = ref<string | null>(null);
const runId = computed(() => pickedRunId.value ?? runDataActiveRun?.data?.id ?? null);
const run = computed(() => runDataArray?.data?.find((r) => r.id === runId.value));
const runOptions = computed(() => (runDataArray?.data ?? []).map((r) => ({
  label: [r.game ?? '???', r.category].filter(Boolean).join(' - '),
  value: r.id,
})));
// Each entry keeps the ID of its run, so an edit still being typed when the run changes is saved to the right run.
const players = computed(() => {
  const r = run.value;
  return r?.teams.flatMap((team, teamIndex) => team.players
    .map((player, playerIndex) => ({ runId: r.id, player, teamIndex, playerIndex }))) ?? [];
});

function getOverride(playerId: string, key: PlayerKey) {
  return runId.value ? runCustomisation?.data?.[runId.value]?.players[playerId]?.[key] : undefined;
}

/**
 * Values set in the run's custom data, shown as the placeholder/default.
 */
function getDefault(teamIndex: number, playerIndex: number, key: PlayerKey) {
  return getPlayerCustomisation(run.value, undefined, teamIndex, playerIndex)[key];
}

/**
 * Sets (or removes, if empty) an override for a run; empty entries are cleaned up so the replicant stays tidy.
 * Takes the run ID rather than using the selected one, as inputs save after a short delay and the run may have changed.
 */
function update(id: string, change: (entry: NonNullable<NonNullable<typeof runCustomisation>['data']>[string]) => void) {
  const data = runCustomisation?.data;
  if (!runCustomisation || !data) return;
  data[id] ??= { players: {} };
  const entry = data[id];
  change(entry);
  for (const [playerId, player] of Object.entries(entry.players)) {
    if (!Object.keys(player).length) delete entry.players[playerId];
  }
  if (!entry.accentColour && !Object.keys(entry.players).length) delete data[id];
  runCustomisation.save();
}
function setPlayer(id: string, playerId: string, key: PlayerKey, val?: string | null) {
  update(id, (entry) => {
    entry.players[playerId] ??= {};
    if (val?.trim()) entry.players[playerId][key] = val.trim();
    else delete entry.players[playerId][key];
  });
}
function setAccent(id: string, val?: string) {
  update(id, (entry) => {
    if (val) entry.accentColour = val;
    else delete entry.accentColour;
  });
}
function resetRun(id: string) {
  update(id, (entry) => {
    entry.players = {};
    delete entry.accentColour;
  });
  if (contentWarnings?.data?.runs[id]) {
    delete contentWarnings.data.runs[id];
    contentWarnings.save();
  }
}

// Content warnings; ticking any of these stores the full list for the run, which then overrides any custom data.
const tickedWarnings = computed(() => getRunWarningIds(run.value, contentWarnings?.data));
function toggleWarning(id: string, val: boolean) {
  if (!contentWarnings?.data || !runId.value) return;
  const ticked = new Set(tickedWarnings.value);
  if (val) ticked.add(id);
  else ticked.delete(id);
  contentWarnings.data.runs[runId.value] = contentWarnings.data.available
    .filter((w) => ticked.has(w.id))
    .map((w) => w.id);
  contentWarnings.save();
}
const editingWarnings = ref(false);
const warningTypes = useDraft(() => contentWarnings?.data?.available, (draft) => {
  if (!contentWarnings?.data) return;
  contentWarnings.data.available = draft
    .filter((w) => w.text.trim())
    .map((w) => ({ ...w, text: w.text.trim() }));
  contentWarnings.save();
});

// What the badge will actually look like on the layout.
function badgePreview(teamIndex: number, playerIndex: number) {
  const custom = getPlayerCustomisation(run.value, runCustomisation?.data, teamIndex, playerIndex);
  return {
    label: custom.badgeLabel ?? 'Runner',
    background: custom.badgeColour ?? 'linear-gradient(33deg, #1b6ebb 0%, #348bd2 100%)',
    color: custom.badgeColour ? getTextColour(custom.badgeColour) : 'white',
  };
}
</script>

<template>
  <div>
    <div class="row items-center no-wrap">
      <QSelect
        :model-value="runId"
        class="col"
        :options="runOptions"
        label="Run"
        emit-value
        map-options
        dense
        square
        outlined
        options-dense
        @update:model-value="(val: string) => { pickedRunId = val; }"
      />
      <QBtn
        class="q-ml-sm"
        color="dark"
        label="Current"
        :disable="!pickedRunId"
        unelevated
        square
        @click="pickedRunId = null"
      />
    </div>
    <div
      v-if="!pickedRunId"
      class="text-caption text-grey-5"
    >
      Following the current run.
    </div>

    <template v-if="run">
      <div class="q-mt-md text-weight-bold">
        Content warnings
      </div>
      <div class="row q-gutter-x-md q-gutter-y-xs">
        <QCheckbox
          v-for="warning in contentWarnings?.data?.available ?? []"
          :key="warning.id"
          :model-value="tickedWarnings.includes(warning.id)"
          :label="warning.text"
          dense
          @update:model-value="(val: boolean) => toggleWarning(warning.id, val)"
        />
      </div>
      <QBtn
        class="q-mt-xs"
        :label="editingWarnings ? 'Hide warning list' : 'Edit warning list'"
        :icon="editingWarnings ? 'expand_less' : 'edit'"
        size="sm"
        flat
        dense
        no-caps
        @click="editingWarnings = !editingWarnings"
      />
      <div
        v-if="editingWarnings"
        class="q-mt-xs"
      >
        <div
          v-for="(warning, i) in warningTypes.draft.value"
          :key="warning.id"
          class="row items-center no-wrap q-mb-xs"
        >
          <QInput
            v-model="warning.text"
            class="col"
            dense
            square
            outlined
          />
          <QBtn
            icon="delete"
            color="negative"
            flat
            dense
            @click="warningTypes.draft.value.splice(i, 1)"
          />
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <QBtn
              class="full-width"
              icon="add"
              label="Add"
              color="dark"
              unelevated
              square
              @click="warningTypes.draft.value.push({ id: newId(), text: '' })"
            />
          </div>
          <div class="col">
            <QBtn
              class="full-width"
              label="Save list"
              color="primary"
              :disable="!warningTypes.dirty.value"
              unelevated
              square
              @click="warningTypes.save"
            />
          </div>
        </div>
      </div>

      <!-- Colours/labels are tucked away so they don't clutter the panel. -->
      <QExpansionItem
        class="q-mt-md"
        :class="$style.Expansion"
        dense
        dense-toggle
        switch-toggle-side
        expand-separator
      >
        <template #header>
          <QItemSection>
            <QItemLabel class="text-weight-bold">
              Colours &amp; badges
            </QItemLabel>
          </QItemSection>
          <QItemSection side>
            <div class="row no-wrap q-gutter-x-xs">
              <div
                v-for="{ player, teamIndex, playerIndex } in players"
                :key="player.id"
                :class="[$style.Badge, $style.BadgeSmall]"
                :style="badgePreview(teamIndex, playerIndex)"
              >
                {{ badgePreview(teamIndex, playerIndex).label }}
              </div>
            </div>
          </QItemSection>
        </template>
        <div class="q-pa-sm">
          <div class="q-mt-md text-weight-bold">
            Run info accent
          </div>
          <!-- A one-item loop so the input is remade for each run, and an edit still being typed saves to its own run. -->
          <ColourInput
            v-for="r in [run]"
            :key="r.id"
            :model-value="runCustomisation?.data?.[r.id]?.accentColour"
            label="Accent colour (game/category box)"
            :placeholder="getAccentColour(r, undefined)"
            @update:model-value="(val) => setAccent(r.id, val)"
          />

          <QCard
            v-for="{ runId: playerRunId, player, teamIndex, playerIndex } in players"
            :key="player.id"
            class="q-mt-md"
            flat
            bordered
            square
          >
            <QCardSection class="q-pb-sm">
              <div class="row items-center no-wrap">
                <div
                  :class="$style.Badge"
                  :style="badgePreview(teamIndex, playerIndex)"
                >
                  {{ badgePreview(teamIndex, playerIndex).label }}
                </div>
                <div class="q-ml-sm text-subtitle1 text-weight-bold ellipsis">
                  {{ player.name }}
                </div>
              </div>
            </QCardSection>
            <QCardSection class="q-pt-none">
              <QInput
                :model-value="getOverride(player.id, 'badgeLabel') ?? ''"
                label="Badge label"
                :placeholder="getDefault(teamIndex, playerIndex, 'badgeLabel') ?? 'Runner'"
                stack-label
                debounce="500"
                dense
                square
                outlined
                clearable
                @update:model-value="(val) => setPlayer(playerRunId, player.id, 'badgeLabel', val as string | null)"
              />
              <ColourInput
                class="q-mt-sm"
                :model-value="getOverride(player.id, 'badgeColour')"
                label="Badge colour"
                :placeholder="getDefault(teamIndex, playerIndex, 'badgeColour')"
                @update:model-value="(val) => setPlayer(playerRunId, player.id, 'badgeColour', val)"
              />
              <ColourInput
                class="q-mt-sm"
                :model-value="getOverride(player.id, 'feedColour')"
                label="Game feed border colour"
                :placeholder="getDefault(teamIndex, playerIndex, 'feedColour')"
                @update:model-value="(val) => setPlayer(playerRunId, player.id, 'feedColour', val)"
              />
            </QCardSection>
          </QCard>
          <div class="q-mt-md text-caption text-grey-5">
            Defaults can also be set ahead of time in the speedcontrol run editor using the custom data fields
            <b>badgeColour</b>, <b>badgeLabel</b> and <b>feedColour</b> (one value for everyone, or a comma separated
            list in player order), <b>accentColour</b> and <b>contentWarnings</b> (comma separated warning names).
            Anything set here takes priority.
          </div>
        </div>
      </QExpansionItem>

      <QBtn
        class="full-width q-mt-md"
        color="negative"
        label="Reset this run to defaults"
        :disable="!runCustomisation?.data?.[run.id] && !contentWarnings?.data?.runs[run.id]"
        unelevated
        square
        @click="resetRun(run.id)"
      />
    </template>
    <div
      v-else
      class="q-mt-md text-grey-5"
    >
      No run selected.
    </div>
  </div>
</template>

<style lang="scss" module>
.Expansion {
  border: 1px solid rgba(255, 255, 255, 0.28);
}

.Badge {
  flex: 0 0 auto;
  padding: 4px 10px;
  font-weight: 700;
  text-transform: uppercase;
  clip-path: polygon(0% 0%, 0% calc(100% - 6px), 6px 100%, 100% 100%, 100% 0%);
}

.BadgeSmall {
  padding: 2px 6px;
  font-size: 11px;
}
</style>
