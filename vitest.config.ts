import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // allows to keep using 'describe' and 'it' without importing them
    environment: 'node',
  },
});
