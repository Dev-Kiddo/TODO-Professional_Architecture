import AsyncHandler from "../utils/AsyncHandler.js";
import pool from "../config/dbConfig.js";
import amqp from "amqplib";

export const createTodo = AsyncHandler(async (req, res, next) => {
  const currentUser = req.user;

  const { title, description } = req.body;

  const initilizeTable = await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(100) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
        `);

  //? OPTION 2 API Call to Verify User Exists
  //* If user-service is DOWN → todo creation FAILS!
  //* This creates tight coupling between services!

  // const userResponse = await fetch(`http://localhost:5001/api/v1/users/${currentUser.id}`, {
  //   method: "GET",
  //   credentials: "include",
  //   headers: {
  //     Cookie: req.headers.cookie,
  //   },
  // });

  // if (!userResponse.ok) {
  //   console.log("Failed to fetch");
  //   throw new Error("Failed to fetch User");
  // }

  // const { data } = await userResponse.json();

  // if (currentUser.id !== data.id) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Current User Not Found On UsersDB!",
  //   });
  // }

  //? Option 3: Event-Driven (Advanced - RabbitMQ)

  const todo = await pool.query(
    `
          INSERT INTO todos(title, description, user_id)
          VALUES($1, $2, $3)
          RETURNING *
          `,
    [title, description, currentUser.id],
  );

  //? RABBITMW CONFIG's

  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  const channel = await connection.createChannel();

  const queueName = "todo_created";

  await channel.assertQueue(queueName, { durable: true });

  const bufferMessage = Buffer.from(JSON.stringify({ event: queueName, data: todo.rows[0], email: currentUser.email }));

  channel.sendToQueue(queueName, bufferMessage);

  setTimeout(async () => {
    await connection.close();
    console.log(`Connection closed todo_created`);
  }, 500);

  return res.status(200).json({
    success: true,
    message: "Todo Created Successfully!",
    todo: todo.rows[0],
  });
});

export const getTodos = AsyncHandler(async function (req, res, next) {
  const currentUser = req.user;

  if (!currentUser) {
    return res.status(400).json({
      success: false,
      message: "Auth Not Found!",
    });
  }

  const todos = await pool.query(
    `
    SELECT * FROM todos WHERE user_id=$1
    `,
    [currentUser.id],
  );

  if (todos.rows.length === 0) {
    return res.status(200).json({
      success: true,
      message: " No todo found!",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Todos Get Successfully!",
    todosCount: todos.rows.length,
    todo: todos.rows,
  });
});

export const updateTodo = AsyncHandler(async function (req, res, next) {
  const { id } = req.params;

  const updateData = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Todo ID Not Found!",
    });
  }

  const todo = await pool.query(
    `
    SELECT * FROM todos
    WHERE id=$1
    `,
    [id],
  );

  // console.log(todo.rows[0]);
  // console.log(id);

  if (todo.rows[0].id !== parseInt(id)) {
    return res.status(400).json({
      success: false,
      message: "Todo Not Found!",
    });
  }

  console.log("updateData", updateData);

  const updateKeys = Object.keys(updateData);
  const updateValues = Object.values(updateData);

  if (updateKeys.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No Fields Provided!",
    });
  }

  const setClause = updateKeys.map((key, index) => `${key}=$${index + 1}`).join(", ");

  updateValues.push(id);

  // console.log("setClause", setClause);
  // console.log("updateValues", updateValues);

  const updateTodo = await pool.query(
    `
    UPDATE todos
    SET ${setClause}
    WHERE id=$${updateKeys.length + 1}
    RETURNING *
    `,
    updateValues,
  );

  res.status(200).json({
    success: true,
    message: "Todo Updated Successfully",
    todo: updateTodo.rows[0],
  });
});

export const deleteTodo = AsyncHandler(async function (req, res, next) {
  const { id } = req.params;

  const todoExists = await pool.query(
    `
    SELECT * FROM todos
    WHERE id=$1
    `,
    [id],
  );

  if (todoExists.rows[0].id !== parseInt(id)) {
    return res.status(400).json({
      success: false,
      message: "Todo Not Found!",
    });
  }

  await pool.query(
    `
    DELETE FROM todos
    WHERE id=$1
    `,
    [id],
  );

  return res.status(200).json({
    success: true,
    message: "Delete todo successfully!",
  });
});
