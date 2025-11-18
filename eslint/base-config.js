import { defineConfig } from 'eslint-define-config';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import fs from 'node:fs';
import path from 'node:path';

const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

export default defineConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: fs.existsSync(tsconfigPath) ? tsconfigPath : undefined,
        tsconfigRootDir: process.cwd(),
        sourceType: 'module'
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: eslintPluginPrettier
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'no-undef': 'error',
      'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      sourceType: 'module'
    },
    rules: {}
  }
]);