import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-md p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <a href="/">

        <div className="text-2xl font-bold text-gray-800">Facebook</div>

        </a>


        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
            <a href="/login">login</a>
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            <a href="/signup">Sign up</a>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;