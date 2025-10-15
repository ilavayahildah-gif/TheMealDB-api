import {pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text:string, params?: any[]) => pool.query(text, params);

export default pool;