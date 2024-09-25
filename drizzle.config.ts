import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './db/schema.ts',
    out: './db/migrations',
    dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        url: './db/db.sqlite'
        // host: process.env.DB_HOST,
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_NAME,
    },
});