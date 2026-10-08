import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Relative base so the built site works at a domain root or in a subfolder.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
