import React from "react";

const Error = React.memo(({ message }) => {
  if (!message) return null; // No renderiza nada si no hay mensaje

  console.log("Error UI");
  return <p className="text-red-500 text-sm">{message}</p>;
});

export default Error;
