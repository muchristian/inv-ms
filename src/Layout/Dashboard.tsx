import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeCredentials } from "../redux/slices/auth.slice";
import { useLazyLogoutQuery } from "../utils/apis/auth";
import { baseApi } from "../utils/baseUrl";
import { Sidenav } from "./Sidenav/Sidenav";
// import jwt from "jsonwebtoken";
import { Button } from "../components/Button/Button";
import Sidebar from "./Sidebar/Sidebar";
import { Navbar } from "./Navbar/Navbar";

interface props {
  children: JSX.Element;
  title?: string;
}

const Dashboard: React.FC<props> = ({ children, title }) => {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  const toggleSidebarHandler = () => {
    setToggleSidebar(!toggleSidebar);
  };
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar toggleSidebar={toggleSidebar} />
        <main
          className={`flex flex-col flex-1 bg-primary ${title} ${
            !toggleSidebar ? "ml-0" : "ml-[260px]"
          }`}
          style={{ transition: "margin-left 300ms" }}
        >
          <Navbar classes="analytics" onToggleSidebar={toggleSidebarHandler}>
            <></>
          </Navbar>
          {children}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
