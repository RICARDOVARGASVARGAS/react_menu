import React from "react";

export const Label = ({ children, ...props }) => {
  return (
    <label className="block text-sm font-semibold text-gray-700" {...props}>
      {children}
    </label>
  );
};