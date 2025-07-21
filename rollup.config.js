// rollup.config.js
import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: './lib/blaze.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    typescript()
  ]
};
