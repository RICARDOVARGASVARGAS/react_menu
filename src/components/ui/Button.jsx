// components/ui/Button.js
import React from "react";
import PropTypes from "prop-types";

export const Button = React.memo(({ children, color = "blue", ...props }) => {
  // Mapeo de colores a clases de Tailwind CSS
  const colorStyles = {
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    gray: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    yellow:
      "bg-yellow-300 hover:bg-yellow-400 focus:ring-yellow-500 text-black", // Texto negro para mejor contraste
  };

  // Clases base
  const baseStyles = `py-2 px-6 rounded text-white flex items-center gap-2 transition duration-300 ease-in-out ${
    props.disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  // Si el color no está en el mapa, usa una clase genérica
  const dynamicColorStyle =
    colorStyles[color] ||
    `bg-${color}-600 hover:bg-${color}-700 focus:ring-${color}-500`;

  return (
    <button className={`${baseStyles} ${dynamicColorStyle}`} {...props}>
      {children}
    </button>
  );
})

// Validación de tipos
Button.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["blue", "gray", "red", "green", "yellow"]),
};
