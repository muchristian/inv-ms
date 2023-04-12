import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshResponse } from "./models";
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_PUBLIC_API_URL,
  credentials: "include",
});
const baseQueryWithRefresh: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/users/login",
        method: "POST",
      },
      api,
      extraOptions
    );
    if (typeof (refreshResult.data as refreshResponse).payload === "string") {
      result = await baseQuery(args, api, extraOptions);
    } else {
      // api.dispatch(removeCredentials())
      baseApi.util.resetApiState();
    }
  }
  return result;
};

export const tagTypes = [
  "Transactions",
  "Wallets",
  "Transaction-types",
  "Categories",
  "Analytics",
  "Auth",
  "Product",
  "Hold",
  "Stock",
];
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Transactions",
    "Wallets",
    "Transaction-types",
    "Categories",
    "Analytics",
    "Auth",
    "Product",
    "Customer",
    "Hold",
    "Stock",
    "Comptoir",
    "Expense",
  ],
  endpoints: () => ({}),
});
