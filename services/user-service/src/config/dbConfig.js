import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  database: "user-service",
  port: "5432",
});

pool.on("connect", () => {
  console.log(`Postgres User Service Connected successfully`);
});

pool.on("error", (error) => {
  console.log(`Unexpected Err on Postgres`, error);
  process.exit(1);
});

export default pool;
