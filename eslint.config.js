import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

import prettier from 'eslint-config-prettier'; // 禁用與 Prettier 衝突的 ESLint 規則
import pluginPrettier from 'eslint-plugin-prettier'; // Prettier 當作 ESLint 規則執行

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      js,
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error', // 格式錯誤會顯示為 ESLint 錯誤
    },
  },
  prettier,
]);
