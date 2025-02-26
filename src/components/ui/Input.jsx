import React from "react";

export const Input = React.forwardRef(({ hasError, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`mt-1 p-2 w-full border rounded ${
        hasError ? "border-red-500" : "border-gray-300"
      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
      {...props}
    />
  );
});
