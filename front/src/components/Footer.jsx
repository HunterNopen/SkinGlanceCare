import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#597E82] w-full text-[#334F4F]">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
        <ul className="flex flex-col sm:flex-row justify-beetween p-5 text-xl sm:gap-8 text-center sm:text-center">
          <li className="my-2">
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
          </li>
          <li className="my-2">
            <Link to="/AboutUs" className="hover:underline">
              About Us
            </Link>
          </li>
          {/* <li className="my-2">
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </li> */}
        </ul>
      </div>

      <div className="border-t border-[#4A6A6D] flex justify-center items-center py-3 text-xs sm:text-sm">
        © {new Date().getFullYear()} SkinGlanceCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
