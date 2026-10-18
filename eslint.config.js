import globals from 'globals'

export default [
  {
    files: ['src/**/*.{js,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        __AI_TABLE_CSS__: 'readonly',
        __EMPTY_STATE_IMAGE__: 'readonly',
        __HILDA_UI_CSS__: 'readonly',
        __PLUGIN_ICON__: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
  {
    files: ['src/**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
]
