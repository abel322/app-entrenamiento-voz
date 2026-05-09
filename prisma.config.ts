import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migration: {
    url: process.env.DATABASE_URL,
  },
});