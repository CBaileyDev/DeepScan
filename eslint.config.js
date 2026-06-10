import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'release/**',
      'coverage/**',
      'out/**',
      'build-scripts/**',
      'apps/**/build-scripts/**',
      'apps/**/dist/**',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
