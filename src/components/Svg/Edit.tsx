import React from "react";

interface props {
  classes?: string;
  onClick?: () => void;
}

export const Edit: React.FC<props> = ({ classes, onClick, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`ionicon ${classes}`}
      viewBox="0 0 512 512"
      onClick={onClick}
    >
      <path
        d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z" />
    </svg>
  );
};
