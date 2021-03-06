import React from "react";

export const Container: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div
      className={`container max-w-screen-lg mx-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
