import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {NOTIFICATION_TYPE} from "react-notifications-component";

export interface GlobalMessageSliceState {
    title: string | null,
    message: string | null,
    type: NOTIFICATION_TYPE,
    requireShowMessageToggle: boolean
}
const initialState: GlobalMessageSliceState = {
    title: null,
    message: null,
    type: "danger",
    requireShowMessageToggle: false
}

export const GlobalMessageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        SetGlobalMessage: (state,
                     action: PayloadAction<{title: string, message: string, type: NOTIFICATION_TYPE}>) => {
            state.title = action.payload.title;
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.requireShowMessageToggle = !state.requireShowMessageToggle;
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