import React, { useContext, useState } from "react";
import ContentBlock from "../components/ContentBlock";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

function Login() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      // console.log("Clicking");

      const res = await axios.post(`${import.meta.env.VITE_USER_SERVICE}/login`, formData, { withCredentials: true });

      // console.log(res);
      setUser(res.data.user);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));

      toast.success(res.data.message);

      navigate("/todo");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
    <section className="min-w-5xl">
      <ContentBlock titleText="Login" descriptionText="To make your time productive!" />

      <div className="max-w-md mx-auto py-8 px-6 rounded-md bg-gray-50 mt-10">
        <form onSubmit={onSubmitHandler}>
          <div className="mb-5">
            <label htmlFor="email" className="hidden">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              autoComplete="off"
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-base font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
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
              className="w-full rounded-md border border-gray-200 bg-white py-3 px-6 text-base font-medium text-gray-500 outline-none focus:border-blue-600 focus:shadow-md"
              value={formData.password}
              onChange={formHandler}
            />
          </div>

          <Button>Login</Button>

          <div className="mt-4">
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
