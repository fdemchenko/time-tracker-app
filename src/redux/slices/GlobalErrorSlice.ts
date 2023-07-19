import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface GlobalErrorSliceState {
    message: string | null
}
const initialState: GlobalErrorSliceState = {
    message: null
}

export const GlobalErrorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        SetGlobalErrorMessage: (state,
                     action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        RemoveGlobalErrorMessage: (state) => {
            state.message = null;
        }
    }
});

export const {
    SetGlobalErrorMessage,
    RemoveGlobalErrorMessage
} = GlobalErrorSlice.actions;

export default GlobalErrorSlice.reducer;