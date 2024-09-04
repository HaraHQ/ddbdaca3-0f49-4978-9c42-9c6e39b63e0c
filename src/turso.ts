import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config();

export const turso = createClient({
  url: process.env.TURSO_URL as string,
  authToken: process.env.TURSO_SECRET as string,
});

export default turso;
