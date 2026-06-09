import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice.js";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) api.dispatch(logout());
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Attendance", "Users", "Report"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    signup: builder.mutation({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),
    managers: builder.query({
      query: () => "/users/managers",
    }),
    users: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
    attendance: builder.query({
      query: (date) => ({
        url: "/attendance",
        params: date ? { date } : undefined,
      }),
      providesTags: ["Attendance"],
    }),
    punchIn: builder.mutation({
      query: (body) => ({ url: "/attendance/punch-in", method: "POST", body }),
      invalidatesTags: ["Attendance", "Report"],
    }),
    punchOut: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/attendance/${id}/punch-out`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Attendance", "Report"],
    }),
    requestOvertime: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/attendance/${id}/overtime`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Attendance", "Report"],
    }),
    reviewOvertime: builder.mutation({
      query: ({ id, status }) => ({
        url: `/attendance/${id}/overtime`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Attendance", "Report"],
    }),
    validateAttendance: builder.mutation({
      query: ({ id, status, remarks }) => ({
        url: `/attendance/${id}/validate`,
        method: "PATCH",
        body: {
          validationStatus: status,
          validationRemarks: remarks,
        },
      }),
      invalidatesTags: ["Attendance", "Report"],
    }),
    dailyReport: builder.query({
      query: (date) => ({ url: "/reports/daily", params: { date } }),
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useManagersQuery,
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAttendanceQuery,
  usePunchInMutation,
  usePunchOutMutation,
  useRequestOvertimeMutation,
  useReviewOvertimeMutation,
  useValidateAttendanceMutation,
  useDailyReportQuery,
} = api;
