import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavigationMenu from "./NavigationMenu";

function Navigation() {
  const [showMenu, setShowMenu] = useState(false);

  let menu;
  let menuMask;

  if (showMenu) {
    // Verificăm dacă trebuie să afișăm meniul
    menu = (
      <div className="fixed bg-white top-0 left-0 w-4/5 h-full z-50 shadow"
      onClick={() => setShowMenu(false)}>
        <NavigationMenu />
        
      </div>
    );

    // Verificăm dacă trebuie să afișăm mască pentru meniu
    menuMask = (
      <div
        className="bg-black-t-50 fixed top-0 left-0 w-full h-full z-50"
        onClick={() => setShowMenu(false)} // Ascunde meniul la click pe mască
      ></div>
    );
  }

  return (
    <nav>
      <span className="text-xl">
        <FontAwesomeIcon
          icon={faBars}
          onClick={() => setShowMenu(!showMenu)} // Deschide/închide meniul la click pe pictograma de bara
        />
      </span>

      {menuMask} {/* Renderează mască meniu */}
      {menu} {/* Renderează meniul */}
    </nav>
  );
}

export default Navigation;
