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
  const width = size === "lg" ? "w-8" : `w-6`;
  const height = size === "lg" ? "h-8" : `h-6`;

  const bg = placeholder ? "bg" : color ? color : "bg-gray-100";

  return (
    <span
      className={`inline-block ${bg} ${width} ${height} rounded-md ml-1 first:ml-[0px]`}
      style={{ background: color }}
    />
  );
};
