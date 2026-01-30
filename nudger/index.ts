import { Client } from 'pg';


const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection(): Promise<void> {
  try {
    await client.connect();
    console.log("Successfully connected to PostgreSQL");
    
    // Heartbeat logic to monitor your weekly target of 5 applications
    setInterval(() => {
      const now = new Date().toISOString();
      console.log(`[${now}] Nudger is monitoring application targets...`);
    }, 10000);
    
  } catch (err) {
    console.error("Database connection error", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

testConnection();