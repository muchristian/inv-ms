import { createApi } from "@reduxjs/toolkit/query/react";
import {
  categoriesBody,
  categoriesQueries,
  categoriesResponse,
  categoriesResponse1,
} from "../models";
import QueryString from "qs";
import { baseApi } from "../baseUrl";
import omit from "lodash.omit";

export const categoryApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/categories/categories?${queries}`;
      },
      providesTags: ["Categories"],
    }),
    getAllCategories: builder.query<any, any>({
      query: (arg) => {
        return `/categories/categories/all`;
      },
      providesTags: ["Categories"],
    }),
    addCategory: builder.mutation<any, categoriesBody>({
      query: (productCategory) => {
        return {
          url: `/categories/category`,
          method: "POST",
          body: { data: productCategory },
        };
      },
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<any, Partial<categoriesBody>>({
      query: (data) => {
        const { id } = data;
        return {
          url: `/categories/category/${id}`,
          method: "PUT",
          body: { ...omit(data, ["id"]) },
        };
      },
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<any, any>({
      query: (value) => {
        return {
          url: `/categories/category/${value.id}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useLazyGetAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApis;
