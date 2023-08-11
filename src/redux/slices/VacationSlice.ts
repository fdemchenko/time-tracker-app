import {VacationResponse} from "../../models/vacation/VacationResponse";
import {VacationInfo} from "../../models/vacation/VacationInfo";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface VacationSliceState {
    vacationList: VacationResponse[],
    vacationInfo: VacationInfo | null,
    isLoading: boolean,
    error: string | null
}
const initialState: VacationSliceState = {
    vacationList: [],
    vacationInfo: null,
    isLoading: false,
    error: null
};

export const VacationSlice = createSlice({
    name: "vacation",
    initialState,
    reducers: {
        SetVacationList: (state, action: PayloadAction<VacationResponse[]>) => {
            state.vacationList = action.payload;
            state.error = null;
        },
        SetVacationInfo: (state, action: PayloadAction<VacationInfo>) => {
            state.vacationInfo = action.payload;
            state.error = null;
        },
        SetVacationError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        SetIsVacationLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const {
    SetVacationList,
    SetVacationInfo,
    SetVacationError,
    SetIsVacationLoading
} = VacationSlice.actions;

export default VacationSlice.reducer;