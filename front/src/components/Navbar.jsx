import { MdClose, MdMenu } from "react-icons/md";

import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/img/logo.png";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  const navLinks = [
    { name: "Skin examination", to: "/UploadImage" },
    { name: "History", to: "/HistoryPage" },
    { name: "Profile", to: "/ProfilePage" },
  ];

  return (
    <nav className="w-full bg-white fixed z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-[100px]">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" alt="logo" />
            <span className="text-[#334F4F] font-semibold text-2xl">
              SkinGlanceCare
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-gray-600 text-lg font-semibold hover:text-[#334F4F]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex">
            <Link to="/FinalForm?mode=login">
              <button className="bg-[#334F4F] text-white px-5 py-2 rounded-2xl text-lg hover:bg-[#2a3f41] transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)}>
              {open ? (
                <MdClose className="text-4xl text-gray-700" />
              ) : (
                <MdMenu className="text-4xl text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-lg absolute w-full top-[100px] left-0 z-40">
          <ul className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-gray-700 text-xl font-semibold hover:text-[#334F4F]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/FinalForm?mode=login" onClick={() => setOpen(false)}>
                <button className="bg-[#334F4F] text-white px-5 py-2 rounded-2xl text-lg hover:bg-[#2a3f41] transition-colors">
                  Get Started
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
