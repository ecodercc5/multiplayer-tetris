import React from "react";

interface Props {
  placeholder?: boolean;
  size?: "sm" | "lg";
  color?: string;
}

export const Cell: React.FC<Props> = ({
  size = "lg",
  color = "bg-gray-100",
  placeholder = false,
}) => {
  // const width = size === "lg" ? "w-6" : `w-6`;
  // const height = size === "lg" ? "h-6" : `h-6`;

  const bg = placeholder ? color : color ? color : "bg-gray-100";

  // console.log({ bg });

  return (
    <span
      className={`inline-block ${bg} w-6 h-6 rounded-md ml-1 first:ml-[0px]`}
      style={{ background: color }}
    />
  );
};
