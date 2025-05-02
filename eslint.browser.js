// @ts-check
import stylistic from '@stylistic/eslint-plugin';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

/* Rules used for anything browser related (dashboard and graphics). */
export default tseslint.config({
  extends: defineConfigWithVueTs(
    pluginVue.configs['flat/recommended'],
    vueTsConfigs.recommended,
  ),
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    // Allows "main.vue" files to be named as such.
    'vue/multi-word-component-names': ['error', { ignores: ['main'] }],
    '@stylistic/quotes': ['error', 'single'],
  },
  files: [
    'src/browser_shared/**/*.ts',
    'src/browser_shared/**/*.vue',
    'src/dashboard/**/*.ts',
    'src/dashboard/**/*.vue',
    'src/graphics/**/*.ts',
    'src/graphics/**/*.vue',
  ],
});
