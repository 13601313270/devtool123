module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'space-before-function-paren': 'off',
    'eol-last': 'off',
    'no-trailing-spaces': 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    'vue/multi-word-component-names': 'off',
    'brace-style': 'off',
    quotes: 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'no-async-promise-executor': 'off',
    'operator-linebreak': 'off',
    'vue/require-v-for-key': 'off',
    'vue/valid-v-for': 'off',
    'prefer-rest-params': 'off',
    'no-empty': 'off',
    'no-useless-return': 'off',
    'prefer-promise-reject-errors': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  env: {
    'vue/setup-compiler-macros': true
  }
}