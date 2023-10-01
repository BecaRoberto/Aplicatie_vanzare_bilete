import React from 'react'
import { Link } from "react-router-dom"

function NavigationMenu(props) {
  return (
    <div>
      {/* Elementul de titlu al meniului */}
      <div className="font-bold block py-3 px-4 border-t border-b border-gray-700">
        EVENT APP
      </div>

      {/* Lista de elemente de meniu */}
      <ul>
        <li>
          {/* Elementul de meniu pentru pagina Home */}
          <Link
            to="/"
            className="block py-3 px-4 border-t border-b border-gray-700 hover:bg-gray-400"
            onClick={props.closeShowMenu} // Închide meniul la click pe elementul de meniu
            style={{ color: 'black' }} // Stil pentru culoarea textului
          >
            Home
          </Link>
        </li>
        <li>
          {/* Elementul de meniu pentru pagina Register/Login */}
          <Link
            to="/Register&Login"
            className="block py-3 px-4 border-b border-gray-700 hover:bg-gray-400"
            onClick={props.closeShowMenu} // Închide meniul la click pe elementul de meniu
            style={{ color: 'black' }} // Stil pentru culoarea textului
          >
            Register/Login
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default NavigationMenu;
