import React, { useState } from "react";
import ContentBlock from "../components/ContentBlock";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const formHandler = function (event) {
    const { id, value } = event.target;
    setFormData((data) => ({ ...data, [id]: value }));
  };

  const onSubmitHandler = async function (e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_USER_SERVICE}/register`, formData);

      console.log("RES", res);
      navigate("/login");
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="min-w-5xl">
      <ContentBlock titleText="Register" descriptionText="Signup to take control of your day!" />

      <div className="max-w-md mx-auto py-8 px-6 rounded-md bg-gray-50 mt-10">
        <form onSubmit={onSubmitHandler}>
          <div className="mb-5">
            <label htmlFor="name" className="hidden">
              name
            </label>
            <input
              type="name"
              id="name"
              placeholder="Name"
              autoComplete="off"
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-sm font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.name}
              onChange={formHandler}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="hidden">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              autoComplete="off"
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-sm font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.email}
              onChange={formHandler}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="pasword" className="hidden">
              password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-sm font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.password}
              onChange={formHandler}
            />
          </div>

          <Button>Login</Button>

          <div className="mt-4">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Register;
