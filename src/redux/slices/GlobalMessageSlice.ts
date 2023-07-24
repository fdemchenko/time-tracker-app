import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface GlobalMessageSliceState {
    message: string | null
}
const initialState: GlobalMessageSliceState = {
    message: null
}

export const GlobalMessageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        SetGlobalMessage: (state,
                     action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        RemoveGlobalMessage: (state) => {
            state.message = null;
        }
    }
});

export const {
    SetGlobalMessage,
    RemoveGlobalMessage
} = GlobalMessageSlice.actions;

export default GlobalMessageSlice.reducer;