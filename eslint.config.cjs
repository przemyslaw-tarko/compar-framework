const prettier = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['apps/test-bookstore/**'],
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
