import React from "react";
import {
  matchRoutes,
  NavLink,
  useLocation,
  useMatch,
  useResolvedPath,
  matchPath,
} from "react-router-dom";

interface props {
  link: string;
  classes?: string;
  children: JSX.Element;
  onClick?: () => void;
}

export const Sidenav: React.FC<props> = ({
  link,
  classes,
  children,
  onClick,
}) => {
  return (
    <NavLink
      type="button"
      className={`group px-5 py-4 flex items-center gap-6 rounded-r-xl transition hover:bg-background hover:duration-150 ${classes}`}
      to={link}
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};
