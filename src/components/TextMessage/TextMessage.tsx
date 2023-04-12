import React from "react";

interface props {
  children?: JSX.Element;
}

export const TextMessage: React.FC<props> = ({ children }) => {
  return <p className="mt-2 text-sm text-danger font-medium">{children}</p>;
};
