import WorkSession from "../../models/WorkSession";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface WorkSessionSliceState {
    activeWorkSession: WorkSession | null,
    workSessionsList: {
        count: number,
        items: WorkSession[]
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
                  action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        SetActiveWorkSession: (state
                               , action: PayloadAction<WorkSession | null>) => {
            state.activeWorkSession = action.payload;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        RemoveActiveWorkSession: (state) => {
            state.activeWorkSession = null;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        SetWorkSessionList: (state,
                             action: PayloadAction<{count: number, items: WorkSession[]}>) => {
            state.workSessionsList = action.payload;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        RemoveWorkSessionList: (state) => {
            state.workSessionsList = {
                count: 0,
                items: []
            };
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        SetIsWorkSessionLoading: (state,
                       action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const {
    SetWorkSessionError,
    SetActiveWorkSession,
    RemoveActiveWorkSession,
    SetWorkSessionList,
    RemoveWorkSessionList,
    SetIsWorkSessionLoading
} = WorkSessionSlice.actions;

export default WorkSessionSlice.reducer;