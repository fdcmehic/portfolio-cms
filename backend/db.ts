import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ quiet: true } as any)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export default pool