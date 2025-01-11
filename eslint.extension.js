// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

/* Rules used for anything extension related. */
export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ],
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/quotes': ['error', 'single'],
  },
  files: [
    'src/extension/**/*.ts',
    'src/types/**/*.d.ts',
  ],
  ignores: [
    'src/types/schemas/**/*.d.ts',
    'src/types/env.d.ts',
  ],
});
