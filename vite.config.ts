import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MonospaceLoader',
      fileName: 'monospace-loader',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react'],
      output: { exports: 'named' },
    },
  },
  plugins: [
    dts({ rollupTypes: true }),
  ],
});
