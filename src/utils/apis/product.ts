import { createApi } from "@reduxjs/toolkit/query/react";
import {
  categoriesBody,
  categoriesQueries,
  categoriesResponse,
  categoriesResponse1,
  productBody,
} from "../models";
import QueryString from "qs";
import { baseApi } from "../baseUrl";

export const productApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/inventory/products?${queries}`;
      },
      providesTags: ["Product"],
    }),
    getAllProducts: builder.query<any, any>({
      query: (arg) => {
        return `/inventory/products/all`;
      },
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: `/inventory/product`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<any, any>({
      query: (data) => {
        const { id } = data;
        return {
          url: `/inventory/product/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `/inventory/product/${id}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApis;
