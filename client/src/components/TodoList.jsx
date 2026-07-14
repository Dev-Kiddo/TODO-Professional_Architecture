import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import ActionButton from "./ActionButton";
import { toast } from "react-toastify";

function TodoList() {
  const { todos, setTodos } = useContext(AppContext);

  const [isCheckboxUpdated, setIsCheckboxUpdated] = useState(false);

  console.log(todos);

  const handleCheckBox = function (id) {
    // console.log(id);
    setIsCheckboxUpdated(true);

    setTodos((todos) => todos.map((todo) => (todo.id === id ? { ...todo, is_completed: !todo.is_completed } : todo)));
  };

  const onDeleteHandler = async function (id) {
    const res = await axios.delete(`${import.meta.env.VITE_TODO_SERVICE}/todos/${id}`, { withCredentials: true });

    setTodos((todos) => todos.filter((todo) => todo.id !== id));

    toast.success(res.data.message);

    console.log("RES", res);
  };

  const onUpdateHandler = async function (todo) {
    console.log("Todo", todo);

    const res = await axios.patch(`${import.meta.env.VITE_TODO_SERVICE}/todos/${todo.id}`, { is_completed: todo.is_completed }, { withCredentials: true });

    toast.success(res.data.message);

    console.log("RES", res);
  };

  useEffect(() => {
    const fetchTodos = async function () {
      try {
        const res = await axios.get(`${import.meta.env.VITE_TODO_SERVICE}/todos`, { withCredentials: true });

        setTodos(res.data.todo);
      } catch (error) {
        console.log("Err at Fetch Todo", error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <>
      <div className="rounded-md bg-blue-600">
        <div className="grid grid-cols-5 py-3 text-white text-sm rounded-lg gap-x-5 px-6">
          <div className="font-semibold">Todo</div>
          <div className="col-span-2 font-semibold">Description</div>
          <div className="text-center font-semibold">Status</div>
          <div className="text-center font-semibold">Actions</div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-1">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo.id} className="w-full max-w-6xl grid grid-cols-5  items-center gap-x-5 px-6 py-3 bg-blue-50 rounded-md">
              <div className={`${todo.is_completed ? "line-through" : ""} text-sm`}>{todo.title}</div>

              <div className={`col-span-2 text-sm ${todo.is_completed ? "line-through" : ""} `}>{todo.description}</div>

              <div className="text-center">
                <input type="checkbox" checked={todo.is_completed} onChange={() => handleCheckBox(todo.id)} />
              </div>

              <div className="text-center">
                <ActionButton btnTextClr="text-red-600" onDeleteHandler={() => onDeleteHandler(todo.id)}>
                  Delete
                </ActionButton>
                {isCheckboxUpdated && (
                  <>
                    🔹<ActionButton onDeleteHandler={() => onUpdateHandler(todo)}>Update</ActionButton>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-red-400 text-center my-6">You haven't added any tasks yet!</p>
        )}
      </div>
    </>
  );
}

export default TodoList;
