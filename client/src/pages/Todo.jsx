import React, { useState } from "react";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import TodoList from "../components/TodoList";

function Todo() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const formHandler = function (event) {
    const { id, value } = event.target;
    setFormData((data) => ({ ...data, [id]: value }));
  };

  const onSubmitHandler = function (e) {
    e.preventDefault();

    console.log("Clicking");
  };
  return (
    <section className="min-w-5xl">
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
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-base font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
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
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-base font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.description}
              onChange={formHandler}
            />
          </div>

          <Button>Add task !</Button>
        </form>
      </div>

      <TodoList />
    </section>
  );
}

export default Todo;
