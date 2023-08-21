import {SickLeaveWithRelations} from "../../models/sick-leave/SickLeaveWithRelations";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface SickLeaveSliceState {
    sickLeaveList: SickLeaveWithRelations[],
    isLoading: boolean,
    requireUpdateToggle: boolean,
    error: string | null
}
const initialState: SickLeaveSliceState = {
    sickLeaveList: [],
    isLoading: false,
    requireUpdateToggle: false,
    error: null
}

export const SickLeaveSlice = createSlice({
    name: "sickLeave",
    initialState,
    reducers: {
        SetSickLeaveList: (state, action: PayloadAction<SickLeaveWithRelations[]>) => {
            state.sickLeaveList = action.payload
            state.error = null
        },
        SetSickLeaveError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        SetIsSickLeaveLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        SetSickLeaveRequireUpdate: (state) => {
            state.requireUpdateToggle = !state.requireUpdateToggle;
        }
    }
});

export const {
    SetSickLeaveList,
    SetSickLeaveError,
    SetIsSickLeaveLoading,
    SetSickLeaveRequireUpdate
} = SickLeaveSlice.actions;

export default SickLeaveSlice.reducer;