import React, { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

function ProtectAuth({ children }) {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);
  return children;
}

export default ProtectAuth;
