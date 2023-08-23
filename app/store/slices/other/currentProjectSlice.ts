import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { Project } from '../../../models/project';
import { RootState } from '../../store';

const initialState: Project.ProjectOption = {
  label: 'DRWP',
  value: 'DRWP',
};

const currentProjectSlice = createSlice({
  name: 'currentProject',
  initialState,
  reducers: {
    setCurrentPoroject: (
      state,
      action: PayloadAction<Project.ProjectOption>
    ) => {
      state.label = action.payload.label;
      state.value = action.payload.value;
    },
  },
});

export const { setCurrentPoroject } = currentProjectSlice.actions;

export default currentProjectSlice.reducer;
