import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  name: string;
}

export const Status: React.FC<Props> = ({ name, className, ...props }) => {
  return (
    <div
      className={`flex items-center bg-zinc-50 p-2 py-1 rounded-md border border-zinc-200 ${className}`}
      {...props}
    >
      <span className="inline-block bg-zinc-400 h-[6px] w-[6px] rounded-full mr-1" />
      <span className="text-sm text-zinc-400">{name}</span>
    </div>
  );
};
