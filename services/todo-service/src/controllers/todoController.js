import AsyncHandler from "../utils/AsyncHandler.js";
import pool from "../config/dbConfig.js";

export const createTodo = AsyncHandler(async (req, res, next) => {
  const initilizeTable = await pool.query(`
        CREATE TABLE If NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(100) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
        `);
});
