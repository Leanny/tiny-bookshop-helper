import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

import simpleImportSort from 'eslint-plugin-simple-import-sort'
import importPlugin from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      perfectionist,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          type: 'natural',
          order: 'asc',
        },
      ],
      'perfectionist/sort-objects': ['warn', { type: 'natural', order: 'asc' }],
    },
  },
])
