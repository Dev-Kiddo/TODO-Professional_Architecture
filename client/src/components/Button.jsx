import React from "react";

function Button({ children }) {
  return (
    <button className="hover:shadow-form w-full rounded-md bg-blue-600 py-3 px-8 text-center text-base font-semibold text-white outline-none cursor-pointer hover:bg-blue-700">
      {children}
    </button>
  );
}

export default Button;
