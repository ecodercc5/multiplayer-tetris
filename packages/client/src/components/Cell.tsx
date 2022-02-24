import React from "react";

interface Props {
  placeholder?: boolean;
  size?: "sm" | "lg";
  color?: string;
}

const SIZE_TO_CELL_DIM = {
  lg: ["w-6", "h-6"],
  sm: ["w-5", "h-5"],
};

export const Cell: React.FC<Props> = ({
  size = "lg",
  color = "bg-gray-100",
}) => {
  // const width = size === "lg" ? "w-6" : `w-6`;
  // const height = size === "lg" ? "h-6" : `h-6`;
  const [width, height] = SIZE_TO_CELL_DIM[size];

  const bg = color === "bg-gray-100" ? color : "bg-black";

  // console.log({ bg });

  return (
    <span
      className={`inline-block ${bg} ${width} ${height} rounded-md ml-1 first:ml-[0px]`}
      // style={{ background: color }}
    />
  );
};
