// @ts-check
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'out/**'],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message:
            'Math.random() is non-deterministic and forbidden. Use the mulberry32 PRNG (seeded) instead to keep level generation deterministic.',
        },
      ],
    },
  },
);
