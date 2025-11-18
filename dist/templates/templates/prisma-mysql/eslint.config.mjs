import { defineConfig } from 'eslint-define-config';
import globals from 'globals';
import fs from 'node:fs';

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
    rules: {},
  },
]);
