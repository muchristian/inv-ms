import { createApi } from "@reduxjs/toolkit/query/react";
import { holdBody } from "../models";
import QueryString from "qs";
import { baseApi } from "../baseUrl";

export const holdApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHolds: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/hold/all?${queries}`;
      },
      providesTags: ["Hold"],
    }),
    addHold: builder.mutation<any, holdBody>({
      query: (productCategory) => {
        return {
          url: `/hold/hold`,
          method: "POST",
          body: { data: productCategory },
        };
      },
      invalidatesTags: ["Hold"],
    }),
    updateHold: builder.mutation<any, any>({
      query: (data) => {
        const { id } = data;
        return {
          url: `/hold/hold/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Hold"],
    }),
    deleteHold: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `/hold/hold/${id}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Hold"],
    }),
    totalHold: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/hold/hold/total?${queries}`;
      },
      providesTags: ["Hold"],
    }),
  }),
});

export const {
  useGetHoldsQuery,
  useLazyGetHoldsQuery,
  useAddHoldMutation,
  useUpdateHoldMutation,
  useDeleteHoldMutation,
  useTotalHoldQuery,
} = holdApis;
