import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { removeCredentials } from "../../redux/slices/auth.slice";
import { Sidenav } from "../Sidenav/Sidenav";

interface props {
  toggleSidebar: boolean;
}

const Sidebar: React.FC<props> = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState<string>("dashboard");
  const onLogout = () => {
    const [, path] = window.location.hash.split("#/");
    dispatch(removeCredentials());
    navigate("/", { replace: true });
  };
  return (
    <aside
      className={`sidebar fixed flex-shrink-0 ${
        !toggleSidebar ? "w-0" : "w-[260px]"
      }  bg-primary h-screen overflow-y-auto z-10 shadow-normalRight flex flex-col justify-between`}
      style={{ transition: "width 300ms" }}
    >
      <div>
        <div className="logo h-[60px] flex flex-col justify-center px-5">
          <h1 className="font-semibold text-2xl text-text/80">Hidden Corner</h1>
        </div>
        <div className="sidebar-menu pr-4 flex flex-col gap-2">
          <Sidenav
            link="/category"
            classes={`${location.pathname === "/category" && "bg-background"}`}
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-copy w-5 fill-current group-hover:text-typography-300 transition group-hover:duration-150"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <h6>Category</h6>
            </>
          </Sidenav>
          <Sidenav
            link="/product"
            classes={`${location.pathname === "/product" && "bg-background"}`}
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-shopping-bag w-5 fill-current group-hover:text-typography-300 transition group-hover:duration-150"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <h6>Product</h6>
            </>
          </Sidenav>
          <Sidenav
            link="/"
            classes={`${location.pathname === "/" && "bg-background"}`}
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 96 960 960"
                className="w-5 fill-current group-hover:text-typography-300 transition group-hover:duration-150"
              >
                <path d="M120 914V422q-14-2-27-20t-13-39V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v127q0 21-13 39t-27 20v492q0 23-18.5 42.5T780 976H180q-24 0-42-19.5T120 914Zm60-491v493h600V423H180Zm640-60V236H140v127h680ZM360 633h240v-60H360v60ZM180 916V423v493Z" />
              </svg>
              <h6>Stock</h6>
            </>
          </Sidenav>
          <Sidenav
            link="/comptoir"
            classes={`${location.pathname === "/comptoir" && "bg-background"}`}
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 96 960 960"
                className="w-5 fill-current group-hover:text-typography-300 transition group-hover:duration-150"
              >
                <path d="m240 896 60-150q9-23 29-36.5t45-13.5h76V535q-159-5-264.5-45T80 396q0-58 117-99t283-41q166 0 283 41t117 99q0 54-105.5 94T510 535v161h76q24 0 44.5 13.5T660 746l60 150h-60l-55-140H356l-56 140h-60Zm240-420q108 0 202-22t143-58q-49-36-143-58t-202-22q-108 0-202 22t-143 58q49 36 143 58t202 22Zm0-80Z" />
              </svg>
              <h6>Comptoir</h6>
            </>
          </Sidenav>
          <Sidenav
            link="/expense"
            classes={`${location.pathname === "/expense" && "bg-background"}`}
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 96 960 960"
                className="w-5 fill-current group-hover:text-typography-300 transition group-hover:duration-150"
              >
                <path d="M626 962 480 816l146-146 42 42-73 74h285v60H595l73 74-42 42ZM80 616V516h100v100H80Zm300 0q-58 0-99-41t-41-99V316q0-58 41-99t99-41q58 0 99 41t41 99v160q0 58-41 99t-99 41Zm-.235-60Q413 556 436.5 532.667 460 509.333 460 476V316q0-33.333-23.265-56.667Q413.471 236 380.235 236 347 236 323.5 259.333 300 282.667 300 316v160q0 33.333 23.265 56.667Q346.529 556 379.765 556Z" />
              </svg>
              <h6>Expense</h6>
            </>
          </Sidenav>
          <Sidenav
            link="/hold"
            classes={`${location.pathname === "/hold" && "bg-background"}`}
            // onClick={() => setActive("hold")}
          >
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 96 960 960"
                className="w-5 fill-current group-hover:text-typography-300 transition group-hover:duration-150"
              >
                <path d="M880 316v520q0 24-18 42t-42 18H140q-24 0-42-18t-18-42V316q0-24 18-42t42-18h680q24 0 42 18t18 42ZM140 425h680V316H140v109Zm0 129v282h680V554H140Zm0 282V316v520Z" />
              </svg>
              <h6>Credits</h6>
            </>
          </Sidenav>
        </div>
      </div>
      <div className="pr-4 mb-10">
        <Sidenav
          link="#"
          onClick={onLogout}
          classes="border border-text/10 hover:border-text/5"
        >
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ionicon w-5 fill-current group-hover:text-typography-300 transition group-hover:duration-150"
              viewBox="0 0 512 512"
            >
              <title></title>
              <path
                d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              />
            </svg>
            <h6>Logout</h6>
          </>
        </Sidenav>
      </div>
    </aside>
  );
};

export default Sidebar;
