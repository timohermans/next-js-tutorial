import config from '@/drizzle.config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@/db/schema';

const sqlite = new Database('./db/db.sqlite');
export const db = drizzle(sqlite, { schema });

export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];