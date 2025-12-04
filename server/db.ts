import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { config } from "./config";

neonConfig.webSocketConstructor = ws;

// Configure pool with better timeout handling for Neon's serverless nature
export const pool = new Pool({ 
  connectionString: config.databaseUrl,
  connectionTimeoutMillis: 30000, // 30 seconds to connect (Neon cold start)
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  max: 10, // Maximum pool size
  allowExitOnIdle: true // Allow pool to close when idle
});
export const db = drizzle({ client: pool, schema });

export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return { connected: true };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}
