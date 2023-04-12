import jwtDecode from "jwt-decode";
import { JWT_SECRET } from "../config/constants";

export const isValidToken = (token?: string): boolean => {
  try {
    jwtDecode(token as string);
    return true;
  } catch (error) {
    return false;
  }
};
