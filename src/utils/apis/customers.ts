import { createApi } from "@reduxjs/toolkit/query/react";
import {
  categoriesBody,
  categoriesQueries,
  categoriesResponse,
  categoriesResponse1,
  customerBody,
  customersResponse,
} from "../models";
import QueryString from "qs";
import { baseApi } from "../baseUrl";

export const categoryApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<customersResponse, void>({
      query: (arg) => {
        const queries = QueryString.stringify(arg, {
          encodeValuesOnly: true,
        });
        return `/customers/all`;
      },
      providesTags: ["Customer"],
    }),
    addCustomer: builder.mutation<any, customerBody>({
      query: (customer) => {
        return {
          url: `/customers/customer`,
          method: "POST",
          body: { data: customer },
        };
      },
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<
      categoriesResponse1,
      Partial<categoriesBody>
    >({
      query: (data) => {
        const { id } = data;
        return {
          url: `/categories/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Categories"],
    }),
    deleteCustomer: builder.mutation<
      Pick<categoriesResponse1, "message">,
      categoriesResponse1["data"]["id"]
    >({
      query: (id) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = categoryApis;
