import {
  EntityState,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import { Project } from '../../../models/project';
import { apiSlice } from './apiSlice';

const projectsAdapter = createEntityAdapter<Project.Project>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
const initialState = projectsAdapter.getInitialState();

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<EntityState<Project.Project>, void>({
      query: () => ({
        url: `/jira/getAllProjects`,
        method: 'GET',
      }),
      transformResponse: (responseData: Project.Project[]) => {
        return projectsAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

export const { useGetAllProjectsQuery } = projectApiSlice;

export const selectProjectsState =
  projectApiSlice.endpoints.getAllProjects.select();
export const selectAllProjects = createSelector(
  selectProjectsState,
  (state) => state.data.entities || []
);
