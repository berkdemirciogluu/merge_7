import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { MergeRequest } from '../../../models/merge-request';
import { Common } from '../../../models/common';
import { nanoid } from 'nanoid';

interface State extends EntityState<MergeRequest.Item> {
  id: string;
  pageInformation: EntityState<MergeRequest.PageInformation>;
}

const mergeRequestAdapter = createEntityAdapter<State>();
const mergeRequestInitialState = mergeRequestAdapter.getInitialState();

/* export const mergeRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMergeRequests: builder.query<
      EntityState<MergeRequest.Item>,
      MergeRequest.GetAllMergeRequestsRequest
    >({
      query: (request) => ({
        url: `/merge-request/getAllMergeRequests/${request.projectName}/?page=${request.page}&take=${request.limit}`,
        method: 'GET',
      }),
      transformResponse: (
        responseData: Common.GenericResponse<MergeRequest.GetAllMergeRequestsResponse>
      ) => {
        return mergeRequestAdapter.setAll(
          mergeRequestInitialState,
          responseData.data.items
        );
      },
    }),
  }),
}); */

export const mergeRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMergeRequests: builder.query<
      EntityState<State>,
      MergeRequest.GetAllMergeRequestsRequest
    >({
      query: (request) => ({
        url: `/merge-request/getAllMergeRequests/${request.projectName}/?page=${request.page}&take=${request.limit}`,
        method: 'GET',
      }),
      transformResponse: (
        responseData: Common.GenericResponse<MergeRequest.GetAllMergeRequestsResponse>
      ) => {
        const state: State = {
          id: '1',
          entities: {},
          ids: [],
          pageInformation: { entities: {}, ids: [] },
        };
        responseData.data.items.forEach(
          (item) => (state.entities[item.id] = item)
        );
        responseData.data.items.forEach(
          (item) => (state.ids = [...state.ids, item.id])
        );
        state.id = nanoid();
        state.pageInformation.entities[1] = responseData.data.pageInformation;
        state.pageInformation.ids = [1];
        return mergeRequestAdapter.setAll(mergeRequestInitialState, [state]);
      },
    }),
  }),
});

export const { useGetAllMergeRequestsQuery } = mergeRequestApiSlice;
