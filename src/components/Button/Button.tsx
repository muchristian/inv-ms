import React from "react";

interface props {
  type: "submit" | "reset" | "button";
  classes: string;
  children: JSX.Element;
  onClick?: (data?: {}) => void;
  disabled?: boolean;
}

export const Button: React.FC<props> = ({
  type,
  classes,
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`transition flex items-center gap-2 px-6 py-3 font-semibold rounded-lg text-sm block hover:duration-250 ${classes}`}
      {...rest}
    >
      {children}
    </button>
  );
};
