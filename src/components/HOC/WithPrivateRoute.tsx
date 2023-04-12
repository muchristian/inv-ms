import { redirect, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isValidToken } from "../../utils/jwt";
import {
  removeCredentials,
  setCredentials,
} from "../../redux/slices/auth.slice";
import { baseApi } from "../../utils/baseUrl";
const WithPrivateRoute = (Wrapped: any) => {
  return (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const token = useSelector((state: RootState) => state.auth.authToken);
    const localToken = localStorage.getItem("ems_tkn_");
    if (!token && localToken) dispatch(setCredentials({ token: localToken }));
    if (!token && !localToken) {
      dispatch(removeCredentials());
      dispatch(baseApi.util.resetApiState());
      // redirect("/login");
      return <Navigate to="/login" replace={true} />;
    }
    if (
      (token && !isValidToken(token)) ||
      (localToken && !isValidToken(localToken))
    ) {
      dispatch(removeCredentials());
      dispatch(baseApi.util.resetApiState());
      return <Navigate to="/login" replace={true} />;
      // return null;
    }
    return <Wrapped {...props} />;
  };
};

export default WithPrivateRoute;
