import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { MergeRequest } from '../../../models/merge-request';
import { Common } from '../../../models/common';

const mergeRequestItemsAdapter =
  createEntityAdapter<MergeRequest.GetMergeRequestItemsResponse>();
const initialState = mergeRequestItemsAdapter.getInitialState();

export const mergeRequestItemsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMergeRequestItems: builder.query<
      EntityState<MergeRequest.GetMergeRequestItemsResponse>,
      string
    >({
      query: (request) => ({
        url: `/merge-request/getMergeRequestItems/${request}`,
        method: 'GET',
      }),
      transformResponse: (
        responseData: Common.GenericResponse<
          MergeRequest.GetMergeRequestItemsResponse[]
        >
      ) => {
        return mergeRequestItemsAdapter.setAll(initialState, responseData.data);
      },
      providesTags: (result, error, arg) => [
        { type: 'MergeRequestItem', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'MergeRequestItem', id })),
      ],
    }),
    updateMergeRequest: builder.mutation<
      EntityState<MergeRequest.GetMergeRequestItemsResponse>,
      MergeRequest.UpdateMergeRequestRequest
    >({
      query: (request) => ({
        url: `/merge-request/updateMergeRequest`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (
        responseData: Common.GenericResponse<
          MergeRequest.GetMergeRequestItemsResponse[]
        >
      ) => {
        return mergeRequestItemsAdapter.setAll(initialState, responseData.data);
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'MergeRequestItem', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetMergeRequestItemsQuery, useUpdateMergeRequestMutation } =
  mergeRequestItemsApiSlice;
