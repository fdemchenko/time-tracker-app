import WorkSession from "../../models/work-session/WorkSession";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {WorkSessionWithRelations} from "../../models/work-session/WorkSessionWithRelations";

export interface WorkSessionSliceState {
    activeWorkSession: WorkSession | null,
    workSessionsList: {
        count: number,
        items: WorkSessionWithRelations[]
    },
    isLoading: boolean,
    requireUpdateToggle: boolean
    error: string | null
}
const initialState: WorkSessionSliceState = {
    activeWorkSession: null,
    workSessionsList: {
        count: 0,
        items: []
    },
    isLoading: false,
    requireUpdateToggle: false,
    error: null
}

export const WorkSessionSlice = createSlice({
    name: "workSession",
    initialState,
    reducers: {
        SetWorkSessionError: (state,
                  action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        SetIsWorkSessionLoading: (state,
                                  action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        SetWorkSessionRequireUpdate: (state) => {
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        SetActiveWorkSession: (state, action: PayloadAction<WorkSession | null>) => {
            state.activeWorkSession = action.payload;
            state.error = null;
        },
        SetWorkSessionList: (state, action: PayloadAction<{count: number, items: WorkSessionWithRelations[]}>) => {
            state.workSessionsList = action.payload;
            state.error = null;
        }
    }
});

export const {
  SetIsWorkSessionLoading,
  SetWorkSessionError,
  SetWorkSessionRequireUpdate,
  SetActiveWorkSession,
  SetWorkSessionList
} = WorkSessionSlice.actions;

export default WorkSessionSlice.reducer;