import { redirect, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { isValidToken } from "../../utils/jwt";
import { JWT_SECRET } from "../../config/constants";

const WithPublicRoute = (Wrapped: any) => {
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const token = useSelector((state: RootState) => state.auth.authToken);
    const localToken = localStorage.getItem("ems_tkn_");
    if (
      (token && isValidToken(token)) ||
      (localToken && isValidToken(localToken))
    ) {
      return <Navigate to="/" replace={true} />;
      // return null;
    }
    return <Wrapped {...props} />;
  };
};
export default WithPublicRoute;
