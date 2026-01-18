import { AnimatePresence, motion } from "framer-motion";

import React from "react";

const MobileNav = ({ open }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 w-full h-screen  z-50"
        >
          <div className="text-xl font-semibold uppercase bg-amber-400 text-white py-10 m-6 rounded-3xl">
            <ul className="flex flex-col justify-center items-center gap-10">
              <li>Home</li>
              <li>O nas</li>
              <li>Education</li>
              <li>Contact</li>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
