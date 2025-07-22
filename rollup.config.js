import typescript from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: {
    'blaze': './lib/blaze.ts'
  },
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    typescript({
      include: [
        "./lib/**/*.ts"
      ]
    })
  ]
};
