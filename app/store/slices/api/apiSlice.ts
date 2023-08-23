import {
  fetchBaseQuery,
  createApi,
  FetchArgs,
  BaseQueryApi,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { logOut, setCredentials } from '../other/authSlice';
import { getAuthToken } from '../../../utils/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3333/api/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json');
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
): Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
> => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions);
    if (refreshResult.data) {
      api.dispatch(
        setCredentials({
          access_token: refreshResult.data.access_token,
          refresh_token: refreshResult.data.refresh_token,
        })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Project', 'MergeRequest', 'MergeRequestItem'],
  endpoints: (builder) => ({}),
});
