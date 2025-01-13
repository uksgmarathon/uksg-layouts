<script setup lang="ts">
import { useHead } from '@unhead/vue';

useHead({ title: 'game-layout' });
</script>

<template>
  <div class="Background" />
  <RouterView class="Layout" />
</template>

<style lang="css">
/*
  Workaround for CSS ordering being incorrect on build.
  https://github.com/vitejs/vite/issues/3924#issuecomment-1185919568
*/
@import url('../_misc/common.css') layer(layer-1);
</style>
