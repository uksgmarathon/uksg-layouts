// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

/* Rules used for anything extension related (including types). */
export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/quotes': ['error', 'single'],
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { arguments: false } }],
  },
  files: [
    'src/extension/**/*.ts',
    'src/types/**/*.d.ts',
  ],
  ignores: [
    'src/types/schemas/**/*.d.ts',
    'src/types/env.d.ts',
    'src/types/osc.d.ts',
  ],
});
