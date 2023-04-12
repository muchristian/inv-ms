import React from "react";

interface props {
  classes?: string;
  onClick?: (data?: {}) => void;
}

export const Excel: React.FC<props> = ({ classes, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="30"
      height="30"
      viewBox="0 0 256 256"
      xmlSpace="preserve"
    >
      <defs></defs>
      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
        <path
          d="M 78.42 18.345 v 68.502 c 0 1.741 -1.412 3.153 -3.153 3.153 H 14.733 c -1.741 0 -3.153 -1.412 -3.153 -3.153 V 3.153 C 11.58 1.412 12.991 0 14.733 0 h 45.343 L 78.42 18.345 z"
          style={{
            stroke: "none",
            strokeWidth: 1,
            strokeDasharray: "none",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 10,
            fill: "rgb(0,130,83)",
            fillRule: "nonzero",
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <path
          d="M 78.42 18.345 H 62.948 c -1.587 0 -2.873 -1.286 -2.873 -2.873 V 0 L 78.42 18.345 z"
          style={{
            stroke: "none",
            strokeWidth: 1,
            strokeDasharray: "none",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 10,
            fill: "rgb(0,170,109)",
            fillRule: "nonzero",
            opacity: 1,
          }}
          transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
        <polygon
          points="59.53,34.24 50.16,34.24 45,45.05 39.84,34.24 30.47,34.24 40.31,54.88 30.45,75.55 39.83,75.55 45,64.71 50.17,75.55 59.55,75.55 49.69,54.88 "
          style={{
            stroke: "none",
            strokeWidth: 1,
            strokeDasharray: "none",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 10,
            fill: "rgb(255,255,255)",
            fillRule: "nonzero",
            opacity: 1,
          }}
          transform="  matrix(1 0 0 1 0 0) "
        />
      </g>
    </svg>
  );
};
