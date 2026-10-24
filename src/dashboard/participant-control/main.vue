<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { QInput } from 'quasar';
import { ref, watch, type Ref } from 'vue';
import { participants } from '../../browser_shared/replicants';

useHead({ title: 'Participant Control' });
const comm1Name = ref('');
const comm1Pronouns = ref('');
const comm2Name = ref('');
const comm2Pronouns = ref('');
const readerName = ref('');
const readerPronouns = ref('');

// Copies the saved values into the boxes, except for boxes that have been changed here and not saved yet,
// so someone else saving doesn't wipe out what's being typed.
watch(() => participants?.data, (data, old) => {
  if (!data) return;
  const sync = (box: Ref<string>, val?: string, oldVal?: string) => {
    if (!old || box.value === (oldVal ?? '')) box.value = val ?? '';
  };
  sync(comm1Name, data.commentators[0]?.name, old?.commentators[0]?.name);
  sync(comm1Pronouns, data.commentators[0]?.pronouns, old?.commentators[0]?.pronouns);
  sync(comm2Name, data.commentators[1]?.name, old?.commentators[1]?.name);
  sync(comm2Pronouns, data.commentators[1]?.pronouns, old?.commentators[1]?.pronouns);
  sync(readerName, data.readers[0]?.name, old?.readers[0]?.name);
  sync(readerPronouns, data.readers[0]?.pronouns, old?.readers[0]?.pronouns);
}, { immediate: true });

function save() {
  if (!participants) return;
  participants.data = {
    commentators: [
      {
        name: comm1Name.value || '',
        pronouns: comm1Pronouns.value || '',
      },
      {
        name: comm2Name.value || '',
        pronouns: comm2Pronouns.value || '',
      },
    ],
    readers: [
      {
        name: readerName.value || '',
        pronouns: readerPronouns.value || '',
      }
    ],
  };
  participants.save();
}
</script>

<template>
  <div>
    Commentators
    <div class="row full-width">
      <QInput
        v-model="comm1Name"
        :class="$style.Name"
        square
        outlined
        clearable
        label="Name"
      />
      <QInput
        v-model="comm1Pronouns"
        :class="$style.Pronouns"
        square
        outlined
        clearable
        label="Pronouns"
      />
      <QBtn
        color="secondary"
        unelevated
        label="CLEAR"
        square
        @click="() => { comm1Name = ''; comm1Pronouns = ''; }"
      />
    </div>
    <div class="row full-width">
      <QInput
        v-model="comm2Name"
        :class="$style.Name"
        square
        outlined
        clearable
        label="Name"
      />
      <QInput
        v-model="comm2Pronouns"
        :class="$style.Pronouns"
        square
        outlined
        clearable
        label="Pronouns"
      />
      <QBtn
        color="secondary"
        unelevated
        label="CLEAR"
        square
        @click="() => { comm2Name = ''; comm2Pronouns = ''; }"
      />
    </div>
    Reader
    <div class="row full-width">
      <QInput
        v-model="readerName"
        :class="$style.Name"
        square
        outlined
        clearable
        label="Name"
      />
      <QInput
        v-model="readerPronouns"
        :class="$style.Pronouns"
        square
        outlined
        clearable
        label="Pronouns"
      />
      <QBtn
        color="secondary"
        unelevated
        label="Clear"
        square
        @click="() => { readerName = ''; readerPronouns = ''; }"
      />
    </div>
    <QBtn
      class="full-width"
      color="primary"
      unelevated
      label="Save"
      square
      @click="save()"
    />
  </div>
</template>

<style lang="scss" module>
.Name {
  flex: 1;
}

.Pronouns {
  width: 30%;
}
</style>