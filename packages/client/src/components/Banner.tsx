import React from "react";

export const Banner: React.FC = ({ children }) => {
  return (
    <div className="flex justify-center items-center bg-zinc-50 border-b border-zinc-200 py-1">
      {children}
    </div>
  );
};
