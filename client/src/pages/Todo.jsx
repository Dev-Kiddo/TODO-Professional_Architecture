import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import TodoList from "../components/TodoList";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import ContentBlock from "../components/ContentBlock";

function Todo() {
  const { user, todos, setTodos, loading, setLoading } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const formHandler = function (event) {
    const { id, value } = event.target;
    setFormData((data) => ({ ...data, [id]: value }));
  };

  const onSubmitHandler = async function (e) {
    try {
      e.preventDefault();
      setLoading(true);

      // console.log("Clicking");

      const res = await axios.post(`${import.meta.env.VITE_TODO_SERVICE}/todos`, formData, { withCredentials: true });

      // console.log("RES", res);
      // console.log("todos", todos);

      setTodos((todos) => (todos ? [res.data.todo, ...todos] : [res.data.todo]));

      setFormData((form) => ({ ...form, title: "", description: "" }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-w-6xl">
      <ContentBlock titleText={`Welcome back, ${user.name}👋`} descriptionText="Stay organized and make today productive." />
      <div className="max-w-3xl mx-auto py-8 px-6 rounded-md bg-gray-50 my-10">
        <form onSubmit={onSubmitHandler}>
          <div className="mb-5">
            <label htmlFor="title" className="hidden">
              name
            </label>
            <input
              type="title"
              id="title"
              placeholder="Title"
              autoComplete="off"
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-sm font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.title}
              onChange={formHandler}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="description" className="hidden">
              description
            </label>
            <input
              type="text"
              id="description"
              placeholder="Description"
              autoComplete="off"
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-sm font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.description}
              onChange={formHandler}
            />
          </div>

          <Button>{loading ? "Add task..." : "Add Task!"}</Button>
        </form>
      </div>

      <TodoList />
    </section>
  );
}

export default Todo;
