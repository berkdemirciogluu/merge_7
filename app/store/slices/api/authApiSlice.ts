import { apiSlice } from './apiSlice';
import { Auth } from '../../../models/auth';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Auth.Response, Auth.LoginRequest>({
      query: (request) => ({
        url: `/login`,
        method: 'POST',
        body: request,
      }),
    }),
    refresh: builder.mutation<Auth.Response, string>({
      query: (request) => ({
        url: `/refresh-token`,
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation } = userApiSlice;
