import React from "react";

interface props {
  children: JSX.Element;
  classes?: string;
  onToggleSidebar: () => void;
}
export const Navbar: React.FC<props> = ({
  children,
  classes,
  onToggleSidebar,
}) => {
  return (
    <nav className={`navbar bg-transparent  px-6 ${classes}`}>
      <div className="flex justify-between w-full items-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 96 960 960"
            width="32"
            className="fill-text/40 cursor-pointer"
            onClick={onToggleSidebar}
          >
            <path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
          </svg>
        </div>
        {children}
      </div>
    </nav>
  );
};
