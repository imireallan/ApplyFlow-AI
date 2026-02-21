import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Turnn on for prod
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// async function connectWithRetry(retries = 5, delay = 5000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       await client.connect();
//       return;
//     } catch (err) {
//       console.log(`Connection attempt ${i + 1} failed. Retrying in ${delay/1000}s...`);
//       await new Promise(res => setTimeout(res, delay));
//     }
//   }
//   process.exit(1); // Only crash after 5 failed attempts
// }

async function testConnection(): Promise<void> {
  try {
    // Log the attempt (useful for debugging network lag)
    console.log(`Nudger: Connecting to RDS at ${client.host}...`);

    await client.connect();
    console.log("Nudger Service: Successfully connected to PostgreSQL via SSL");

    // ... your heartbeat logic ...
  } catch (err: any) {
    if (err.message.includes("no pg_hba.conf entry")) {
      console.error(
        "CRITICAL: RDS is rejecting non-encrypted connection. Ensure SSL is enabled in the client config.",
      );
    }

    console.error("Nudger Service: Connection failed", {
      code: err.code,
      message: err.message,
      host: client.host,
    });

    process.exit(1);
  }
}

testConnection();
