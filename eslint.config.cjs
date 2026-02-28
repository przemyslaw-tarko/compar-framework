const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'apps/test-bookstore/**',
      'node_modules/**',
      'reports/**'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script'
    },
    rules: {
      'no-console': 'off'
    }
  },
  prettier
];
