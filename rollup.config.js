import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: 'src/workers/*.ts', dest: 'dist/workers' }
      ]
    })
  ],
  output: [
    { file: 'dist/index.cjs.js', format: 'cjs' },
    { file: 'dist/index.esm.js', format: 'esm' }
  ]
};