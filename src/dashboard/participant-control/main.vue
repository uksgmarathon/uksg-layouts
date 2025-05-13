<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { QInput } from 'quasar';
import { ref, watch } from 'vue';
import { participants } from '../../browser_shared/replicants';

useHead({ title: 'Participant Control' });
const comm1Name = ref('');
const comm1Pronouns = ref('');
const comm2Name = ref('');
const comm2Pronouns = ref('');
const readerName = ref('');
const readerPronouns = ref('');

watch(() => participants?.data, (data) => {
  if (!data) return;
  comm1Name.value = data.commentators[0]?.name ?? '';
  comm1Pronouns.value = data.commentators[0]?.pronouns ?? '';
  comm2Name.value = data.commentators[1]?.name ?? '';
  comm2Pronouns.value = data.commentators[1]?.pronouns ?? '';
  readerName.value = data.readers[0]?.name ?? '';
  readerPronouns.value = data.readers[0]?.pronouns ?? '';
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