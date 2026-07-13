import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Header />
      <main className="w-full mx-auto flex justify-center my-10">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
