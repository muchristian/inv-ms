import { login } from "../models";
import { baseApi } from "../baseUrl";

export const authApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, login>({
      query: (data) => {
        return {
          url: `/users/login`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation<any, login>({
      query: (data) => {
        return {
          url: `/users/change-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    logout: builder.query<any, void>({
      query: () => {
        return {
          url: `/auth/logout`,
          method: "GET",
        };
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyLogoutQuery,
  useChangePasswordMutation,
} = authApis;
