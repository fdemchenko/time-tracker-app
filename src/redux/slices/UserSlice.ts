import User from "../../models/User";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserSliceState {
    user: User
    isLogged: boolean,
    isLoginFailed: boolean
    error: string | null,
    isLoading: boolean
}
const initialState: UserSliceState = {
    user: {
        id: "",
        email: "",
        fullName: "",
        employmentRate: 0,
        status: "",
        permissions: ""
    },
    isLogged: false,
    isLoginFailed: false,
    error: null,
    isLoading: false
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        UserRequestStart: (state) => {
            state.isLogged = false;
            state.error = null;
            state.isLoading = true;
        },
        UserRequestFinish: (state) => {
            state.isLoading = false;
        },
        SetUser: (state,
                     action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLogged = true;
            state.isLoginFailed = false;
            state.error = null;
        },
        RemoveUser: (state) => {
            state = initialState;
        },
        SetUserError: (state,
                       action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        SetLoginError: (state,
                        action: PayloadAction<boolean>) => {
            state.isLoginFailed = action.payload;
        }
    }
});

export const {
    UserRequestStart,
    UserRequestFinish,
    SetUser,
    RemoveUser,
    SetUserError,
    SetLoginError
} = UserSlice.actions;


export default UserSlice.reducer;