import React from "react";

function ActionButton({ onDeleteHandler, btnTextClr = "text-blue-600", children }) {
  return (
    <button onClick={onDeleteHandler} className={`${btnTextClr} underline cursor-pointer text-sm`}>
      {children}
    </button>
  );
}

export default ActionButton;
