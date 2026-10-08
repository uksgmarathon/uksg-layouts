<script setup lang="ts">
import type { ComputedRef } from 'vue';

/**
 * Save and Revert buttons for a draft made with useDraft (see draft.ts).
 */
defineProps<{
  draft: { dirty: ComputedRef<boolean>, save: () => void, revert: () => void },
}>();
</script>

<template>
  <div class="row q-col-gutter-sm q-mt-xs">
    <div class="col">
      <QBtn
        class="full-width"
        label="Save"
        color="primary"
        :disable="!draft.dirty.value"
        unelevated
        square
        @click="draft.save"
      />
    </div>
    <div class="col-4">
      <QBtn
        class="full-width"
        label="Revert"
        color="secondary"
        :disable="!draft.dirty.value"
        unelevated
        square
        @click="draft.revert"
      />
    </div>
  </div>
</template>
