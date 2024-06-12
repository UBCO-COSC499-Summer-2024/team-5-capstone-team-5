import React from 'react';
import { NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col justify-between fixed">
      <div>
        <div className="p-4">
          <img src={`${process.env.PUBLIC_URL}/gradeit.svg`} alt="Logo" className="w-32 mx-auto" />
        </div>
        <nav className="px-4 mt-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "block py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => isActive ? "block py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? "block py-2 px-4 mb-2 rounded-lg bg-gray-700 text-white font-bold" : "block py-2 px-4 mb-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"}
          >
            Contact
          </NavLink>
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-300">Recent</h2>
            <ul className="mt-4 space-y-4">
              <li>
                <NavLink
                  to="/course/math-100-003"
                  className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600"
                >
                  <h3 className="text-white font-bold">MATH 100-003</h3>
                  <p className="text-gray-400">Differential Calculus</p>
                  <p className="text-gray-500">Winter 2024</p>
                </NavLink>
              </li>
              {/* Add more courses as needed */}
            </ul>
          </div>
        </nav>
      </div>
      <div className="p-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default Navbar;
