import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
});

pool.on("connect", () => {
  console.log(`Postgres User Service Connected successfully`);
});

pool.on("error", (error) => {
  console.log(`Unexpected Err on Postgres`, error);
  process.exit(1);
});

export default pool;
