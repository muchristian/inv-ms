import { createApi } from "@reduxjs/toolkit/query/react";
import omit from "lodash.omit";
// import { stockBody } from "../models";
import QueryString from "qs";
import { baseApi } from "../baseUrl";
import { stockBody } from "../models";

export const stockApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStock: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/inventory/stock/all?${queries}`;
      },
      providesTags: ["Stock"],
    }),
    addStock: builder.mutation<any, Partial<stockBody>>({
      query: (productCategory) => {
        return {
          url: `/inventory/stock/stock`,
          method: "POST",
          body: { data: productCategory },
        };
      },
      invalidatesTags: ["Stock"],
    }),
    updateStock: builder.mutation<any, Partial<stockBody>>({
      query: (data) => {
        const { _id } = data;
        return {
          url: `/inventory/stock/${_id}`,
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
      invalidatesTags: ["Stock"],
    }),
  }),
});

export const {
  useGetStockQuery,
  useLazyGetStockQuery,
  useAddStockMutation,
  useUpdateStockMutation,
} = stockApis;
