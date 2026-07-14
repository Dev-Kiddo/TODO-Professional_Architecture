import React, { createContext, useState } from "react";

export const AppContext = createContext();

function AppProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    return currentUser;
  });

  const value = {
    loading,
    setLoading,
    todos,
    setTodos,
    user,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppProvider;
