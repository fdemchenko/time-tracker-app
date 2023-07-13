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
        Template: (state,
                  action: PayloadAction<boolean>) => {
            //some state logic
        }
    }
});

export const {
    Template
} = WorkSessionSlice.actions;

export default WorkSessionSlice.reducer;