import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const Divider: React.FC<Props> = ({ className, ...props }) => {
  return (
    <div className={`h-[1px] w-full bg-zinc-200 ${className}`} {...props} />
  );
};
