import React from "react";
import Navigation from "./Navigation";
import logo from "./logo.png";

function Header() {
  return (
    <header className="border-b p-3 flex justify-between items-center">
      <span className="font-bold">
        <img src={logo} alt="Logo" style={{ width: "200px", height: "auto" }}/>
      </span>

      <Navigation />
    </header>
  );
}

export default Header;