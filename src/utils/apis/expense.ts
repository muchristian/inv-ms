import { createApi } from "@reduxjs/toolkit/query/react";
import { expenseBody } from "../models";
import QueryString from "qs";
import { baseApi } from "../baseUrl";

export const expenseApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/expense/all?${queries}`;
      },
      providesTags: ["Expense"],
    }),
    addExpense: builder.mutation<any, expenseBody>({
      query: (productCategory) => {
        return {
          url: `/expense/expense`,
          method: "POST",
          body: { data: productCategory },
        };
      },
      invalidatesTags: ["Expense"],
    }),
    updateExpense: builder.mutation<any, any>({
      query: (data) => {
        const { id } = data;
        return {
          url: `/expense/expense/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Expense"],
    }),
    deleteExpense: builder.mutation<any, any>({
      query: (id) => {
        return {
          url: `/expense/expense/${id}/delete`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Expense"],
    }),
    totalExpense: builder.query<any, any>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/expense/expense/total?${queries}`;
      },
      providesTags: ["Expense"],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useLazyGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useTotalExpenseQuery,
} = expenseApis;
