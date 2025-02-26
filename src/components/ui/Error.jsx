import React from "react";

export const Error = React.memo(({ message }) => {
  if (!message) return null; // No renderiza nada si no hay mensaje

  return <p className="text-red-500 text-sm">{message}</p>;
});
