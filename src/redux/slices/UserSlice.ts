import User from "../../models/User";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserSliceState {
    user: User
    isLogged: boolean,
    error: string | null,
    isLoading: boolean
}
const initialState: UserSliceState = {
    user: {
        id: "",
        email: "",
        fullName: "",
        employmentRate: 0,
        employmentDate: "",
        status: "",
        permissions: "",
        hasPassword: false,
        hasValidSetPasswordLink: false
    },
    isLogged: false,
    error: null,
    isLoading: false
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        RequestStart: (state) => {
            state.isLogged = false;
            state.error = null;
            state.isLoading = true;
        },
        RequestFinish: (state) => {
            state.isLoading = false;
        },
        SetUser: (state,
                     action: PayloadAction<User | null>) => {
            if (action.payload !== null) {
                state.user = action.payload;
                state.isLogged = true;
                state.error = null;
            }
        },
        RemoveUser: (state) => {
            state = initialState;
        },
        SetError: (state,
                   action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    }
});

export const {
    RequestStart,
    RequestFinish,
    SetUser,
    RemoveUser,
    SetError,
} = UserSlice.actions;


export default UserSlice.reducer;