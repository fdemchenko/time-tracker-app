import {Holiday} from "../../models/Holiday";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface SchedulerSliceState {
    holidays: Holiday[],
    isLoading: boolean,
    requireUpdateToggle: boolean
    error: string | null
}
const initialState: SchedulerSliceState = {
    holidays: [],
    isLoading: false,
    requireUpdateToggle: false,
    error: null
}

export const SchedulerSlice = createSlice({
    name: "scheduler",
    initialState,
    reducers: {
        SetSchedulerError: (state,
                              action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        SetIsSchedulerLoading: (state,
                                  action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        SetHolidays: (state,
                      action: PayloadAction<Holiday[]>) => {
            state.holidays = action.payload;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        }
    }
});

export const {
    SetSchedulerError,
    SetIsSchedulerLoading,
    SetHolidays
} = SchedulerSlice.actions;

export default SchedulerSlice.reducer;