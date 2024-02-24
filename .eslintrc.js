module.exports = {
  env: {
    browser: true,
    jquery: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaFeatures: {
      globalReturn: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
    ecmaVersion: 'latest',
  },
  rules: {
    'func-names': ['error', 'never'],
    'no-console': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
  },
};
