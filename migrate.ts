import { config } from 'dotenv';
import { createClient } from '@libsql/client';

config();

const _turso = createClient({
  url: process.env.TURSO_URL as string,
  authToken: process.env.TURSO_SECRET as string,
});

const data = [
  {
    key: 'users',
    fields: [
      { f: 'id', t: 'TEXT', pk: true },
      { f: 'firstName', t: 'TEXT' },
      { f: 'lastName', t: 'TEXT' },
      { f: 'position', t: 'TEXT' },
      { f: 'phone', t: 'TEXT' },
      { f: 'email', t: 'TEXT' },
      { f: 'created_at', t: 'REAL' },
      { f: 'updated_at', t: 'REAL' },
    ],
  },
];

const generateCreateTableStatements = (data: any) => {
  return data.map(async (table: any) => {
    const fields = table.fields
      .map((field: any) => {
        const primaryKey = field.pk ? ' PRIMARY KEY' : '';
        return `${field.f} ${field.t}${primaryKey}`;
      })
      .join(', ');

    try {
      await _turso.execute(
        `CREATE TABLE IF NOT EXISTS ${table.key} (${fields});`,
      );
      console.log(`Migration table: ${table.key} => successful`);
    } catch (error) {
      console.error(`Migration table: ${table.key} => failed:`, error);
    }
  });
};

generateCreateTableStatements(data);
