import React, { useState } from "react";
import Navbar from "./Navbar"; 

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState("");

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const storeToken = (token) => {
    localStorage.setItem("authToken", token); 
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError("");
    setSuccess("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.trim() === "") {
      setError("Password is required.");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }
      storeToken(data.token); 
      setSuccess("Login successful! Redirecting...");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        window.location.href = "/Post"; 
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex justify-center items-center h-screen" style={{ backgroundColor: '#B2EBF2' }}>
        <div className="w-[300px] border border-gray-300 rounded-lg p-4 bg-white shadow-md">

          <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="w-[90%] h-[30px] mb-2 px-2 border border-gray-300 rounded-lg focus:outline-none text-black transition duration-300 ease-in-out hover:border-[#007BA7]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="w-[90%] h-[30px] mb-2 px-2 border border-gray-300 rounded-lg focus:outline-none text-black transition duration-300 ease-in-out hover:border-[#007BA7]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Error Message Display */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#007BA7] text-white py-2 rounded-lg mt-2 hover:bg-[#005f7f] transition duration-300 ease-in-out"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </main>
    </>
  );
};

export default LoginForm;
