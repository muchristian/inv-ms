import { createApi } from "@reduxjs/toolkit/query/react";
import omit from "lodash.omit";
// import { comptoirBody } from "../models";
import QueryString from "qs";
import { baseApi } from "../baseUrl";
import { comptoirBody } from "../models";

export const comptoirApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComptoir: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/inventory/comptoir/all?${queries}`;
      },
      providesTags: ["Comptoir"],
    }),
    addComptoir: builder.mutation<any, Partial<comptoirBody>>({
      query: (productCategory) => {
        return {
          url: `/inventory/comptoir/comptoir`,
          method: "POST",
          body: { data: productCategory },
        };
      },
      invalidatesTags: ["Comptoir"],
    }),
    updateComptoir: builder.mutation<any, Partial<comptoirBody>>({
      query: (data) => {
        const { _id } = data;
        return {
          url: `/inventory/comptoir/${_id}`,
          method: "PUT",
          body: omit(data, [
            "_id",
            "productId",
            "productName",
            "date",
            "createdAt",
            "updatedAt",
          ]),
        };
      },
      invalidatesTags: ["Comptoir"],
    }),
    totalComptoir: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/inventory/comptoir/total?${queries}`;
      },
      providesTags: ["Comptoir"],
    }),
  }),
});

export const {
  useGetComptoirQuery,
  useLazyGetComptoirQuery,
  useAddComptoirMutation,
  useUpdateComptoirMutation,
  useTotalComptoirQuery,
} = comptoirApis;
