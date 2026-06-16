import pg from 'pg';
const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_O9A5uSMTyKQC@ep-lively-hall-aqje47te-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
try {
  await client.connect();
  const r = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables:', JSON.stringify(r.rows));
  await client.end();
} catch(e) {
  console.error('Error:', e.message);
}
