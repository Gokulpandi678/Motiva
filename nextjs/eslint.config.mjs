import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // This app's JSX/copy was moved verbatim from the original Vite app
      // (which used oxlint, not this ruleset) as part of a zero-visual-drift
      // migration. Both rules are purely stylistic — an unescaped `'`/`"` or
      // a `//`-styled text node renders identically in the browser either
      // way — so silencing them here avoids rewriting copied text for no
      // rendering difference, rather than fixing real bugs.
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-comment-textnodes': 'off',
    },
  },
];
