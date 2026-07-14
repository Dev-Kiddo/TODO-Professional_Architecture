import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import Todo from "./pages/Todo";
import AppProvider from "./contexts/AppContext";
import { ToastContainer } from "react-toastify";
import ProtectAuth from "./components/ProtectAuth";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/todo"
              element={
                <ProtectAuth>
                  <Todo />
                </ProtectAuth>
              }
            />
          </Route>
        </Routes>
        <ToastContainer position="top-center" autoClose={1000} theme="light" />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
