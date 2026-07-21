import { Pool } from "pg";

console.log("TODO", {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
});

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
});

pool.on("connect", () => {
  console.log(`DB Todo Service Connected successfully`);
});

pool.on("error", (error) => {
  console.error(`Unexpected Err on Postgres`, error);
  process.exit(1);
});

export default pool;
