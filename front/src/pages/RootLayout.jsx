import { Link, Outlet } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[100px]">
        <Outlet />
      </main>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default RootLayout;
