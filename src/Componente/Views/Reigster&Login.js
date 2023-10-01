import React, { useState } from "react";
import classNames from "classnames";
import axios from "axios";


function RegisterAndLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);

  const [loginStatus, setLoginStatus] = useState();

  const register = () => {
    axios.post("http://localhost:1433/register", {
      email: email,
      password: password,
    }).then((response) => {
      console.log(response);
    });
  };

  const login = () => {
    axios.post("http://localhost:1433/login", {
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus("Redirecting...");
        window.location.href = "/Template"
      }
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">{isRegister ? "Register" : "Login"}</h1>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className={classNames("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline", {
              "opacity-50 cursor-not-allowed": !email || !password,
            })}
            type="submit"
            disabled={!email || !password}
            onClick={isRegister ? register : login}
          >
            {isRegister ? "Register" : "Login"}
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            type="button"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      </form>
      <h1>{loginStatus}</h1>
    </div>
  );
}

export default RegisterAndLogin
