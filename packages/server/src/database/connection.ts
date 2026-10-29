import { Pool } from 'pg';
import { config } from '../config';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function initDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS oauth_tokens (
        provider VARCHAR(50) PRIMARY KEY,
        access_token TEXT,
        refresh_token_enc TEXT NOT NULL,
        iv VARCHAR(64) NOT NULL,
        auth_tag VARCHAR(64) NOT NULL,
        expiry_date BIGINT,
        user_email VARCHAR(255),
        user_name VARCHAR(255),
        user_picture TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS network_credentials (
        id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        username VARCHAR(100) NOT NULL,
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ PostgreSQL Schema Verified & Initialized');
  } catch (error) {
    console.error('❌ Failed to initialize PostgreSQL database:', error);
    throw error;
  } finally {
    client.release();
  }
}
