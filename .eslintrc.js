module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'array-bracket-spacing': [ 'error', 'always' ],
    'block-scoped-var': 'error',
    'brace-style': 'error',
    'comma-dangle': [ 'error', 'always-multiline' ],
    'comma-spacing': 'error',
    curly: 'error',
    'eol-last': 'error',
    eqeqeq: [
      'error',
      'smart',
    ],
    'func-call-spacing': 'error',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [ { target: './src', from: './test' } ],
      },
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        ignoredNodes: [
          'TemplateLiteral',
        ],
      },
    ],
    'jsx-quotes': [
      'warn',
      'prefer-double',
    ],
    'key-spacing': [
      'error',
      { afterColon: true },
    ],
    'keyword-spacing': 'error',
    'no-extra-parens': 'error',
    'no-multiple-empty-lines': 'error',
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'no-unused-vars': [
      0,
      {
        args: 'none',
        varsIgnorePattern: '^h$',
      },
    ],
    'no-useless-computed-key': 'error',
    'no-whitespace-before-property': 'error',
    'object-curly-spacing': [ 'error', 'always' ],
    'object-shorthand': 'error',
    'one-var-declaration-per-line': [
      'error',
      'always',
    ],
    'operator-linebreak': [
      'error',
      'after',
      {
        overrides: {
          '&&': 'ignore',
          '||': 'ignore',
          '?': 'before',
          ':': 'before',
        },
      },
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: [
          'block-like',
          'return',
        ],
      },
      {
        blankLine: 'always',
        prev: 'block-like',
        next: 'expression',
      },
      {
        blankLine: 'any',
        prev: [
          'const',
          'let',
        ],
        next: [
          'const',
          'let',
        ],
      },
      {
        blankLine: 'never',
        prev: '*',
        next: [
          'case',
          'default',
        ],
      },
    ],
    'prefer-arrow/prefer-arrow-functions': [ 'error' ],
    'prefer-const': 'error',
    'prefer-template': 'error',
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'quote-props': [
      'error',
      'as-needed',
    ],
    'rest-spread-spacing': 'error',
    semi: [
      'error',
      'never',
    ],
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'spaced-comment': 'error',
    'template-curly-spacing': 'off',
    'react/display-name': 'off',
    'react/jsx-curly-spacing': [
      'error',
      { when: 'always' },
    ],
    'react/jsx-first-prop-new-line': 'error',
    'react/jsx-max-props-per-line': [
      'error',
      {
        when: 'multiline',
      },
    ],
    'react/jsx-pascal-case': 'error',
    'react/jsx-tag-spacing': 'error',
    'react/no-danger': 'error',
    'react/no-deprecated': 'off',
    'react/no-did-mount-set-state': 'error',
    'react/no-render-return-value': 'error',
    'react/prefer-stateless-function': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-default-export': 2,
    'import/no-unresolved': 0, // linters are known for being bad at this
    '@typescript-eslint/no-explicit-any': [ 'off' ], // instead of adding eslint-disable everywhere. but don't be lazy with correct types!!!
  },
}
