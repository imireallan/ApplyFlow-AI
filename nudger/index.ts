import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

let hasLoggedHeartbeat = false;
let loopCount = 0;

async function testConnection(): Promise<void> {
  try {
    await client.connect();
    console.log("Nudger Service: Successfully connected to PostgreSQL");

    // Heartbeat logic
    setInterval(() => {
      loopCount++;
      const now = new Date().toISOString();

      // 1. Log ONLY the very first heartbeat to confirm startup
      if (!hasLoggedHeartbeat) {
        console.log(
          `[${now}] Nudger heartbeat initialized. Monitoring application targets...`,
        );
        hasLoggedHeartbeat = true;
      }

      // 2. Log an "All Clear" every 100 cycles (approx. every 16 minutes)
      // This prevents log pollution while proving the service hasn't hung.
      if (loopCount % 100 === 0) {
        console.log(
          `[${now}] Nudger Status: Service active. Cycles completed: ${loopCount}`,
        );
      }

      // TODO: Add Logic
    }, 10000);
  } catch (err) {
    // If the core DB connection fails, the service should crash
    // so that Docker/Kubernetes can attempt a restart.
    console.error(
      "Nudger Service: Database connection error",
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  }
}

testConnection();
