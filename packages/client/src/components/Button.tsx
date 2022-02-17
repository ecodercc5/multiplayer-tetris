import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";

interface Props extends HTMLMotionProps<"button"> {}

export const Button: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <motion.button
      className={`text-sm text-white font-medium bg-[#0080EE] py-1.5 px-2 rounded-md ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
