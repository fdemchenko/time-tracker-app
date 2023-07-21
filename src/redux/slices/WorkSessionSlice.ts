import WorkSession from "../../models/WorkSession";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface WorkSessionSliceState {
    activeWorkSession: WorkSession | null,
    workSessionsList: WorkSession[],
    isLoading: boolean
    error: string | null
}
const initialState: WorkSessionSliceState = {
    activeWorkSession: null,
    workSessionsList: [],
    isLoading: false,
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
        },
        RemoveActiveWorkSession: (state) => {
            state.activeWorkSession = null;
            state.error = null;
        },
        SetWorkSessionList: (state,
                             action: PayloadAction<WorkSession[]>) => {
            state.workSessionsList = action.payload;
            state.error = null;
        },
        RemoveWorkSessionList: (state) => {
            state.workSessionsList = [];
            state.error = null;
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