import WorkSession from "../../models/WorkSession";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface WorkSessionSliceState {
    activeWorkSession: WorkSession | null,
    error: string | null
}
const initialState: WorkSessionSliceState = {
    activeWorkSession: null,
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
                               , action: PayloadAction<WorkSession>) => {
            state.activeWorkSession = action.payload;
            state.error = null;
        }
    }
});

export const {
    SetWorkSessionError,
    SetActiveWorkSession
} = WorkSessionSlice.actions;

export default WorkSessionSlice.reducer;