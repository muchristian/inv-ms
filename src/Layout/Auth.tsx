import React from "react";

interface props {
  children: JSX.Element;
}

const Auth: React.FC<props> = ({ children }) => {
  return (
    <>
      <div
        className="flex flex-col justify-center items-center h-screen"
        style={{
          backgroundColor: "rgb(250 250 250 /1)",
        }}
      >
        <div
          className="w-[72%] md:w-[56%] lg:[48%] xl:w-[42%] 2xl:w-[32%] px-8 py-16 auth rounded-lg bg-primary
         z-30"
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Auth;
