import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Header() {
  const { user, setUser } = useContext(AppContext);

  const onLogoutHandler = async function (e) {
    // console.log("clicking");
    e.preventDefault();

    const res = await axios.get(`${import.meta.env.VITE_USER_SERVICE}/logout`, { withCredentials: true });

    setUser({});
    localStorage.removeItem("currentUser");

    toast.success(res.data.message);
  };

  return (
    <header>
      <nav className="flex py-2 px-4 bg-white border-b border-slate-300 min-h-[68px] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 w-full">
          <Link to="/todo">
            <span className="text-blue-600 font-semibold">Todo Microservices</span>
          </Link>

          {user && Object.keys(user).length !== 0 ? (
            <button onClick={onLogoutHandler} className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer text-white border bg-red-500 hover:bg-red-700 transition-all ">
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="register" className="text-blue-600 py-2 px-3.5 text-sm font-semibold border border-blue-600 rounded-md">
                Register
              </Link>

              <Link
                to="login"
                className="py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all "
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
