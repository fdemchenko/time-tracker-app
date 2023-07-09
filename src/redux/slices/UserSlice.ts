import User from "../../models/User";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserSliceState {
    user: User
    isLogged: boolean,
    isFailed: boolean,
    isLoading: boolean
}
const initialState: UserSliceState = {
    user: {
        Id: "",
        Email: "",
        FullName: "",
        EmploymentRate: 0,
        Status: "",
        Permissions: ""
    },
    isLogged: false,
    isFailed: false,
    isLoading: false
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        AuthStart: (state) => {
            state.isLogged = false;
            state.isFailed = false;
            state.isLoading = true;
        },
        FinishLoading: (state) => {
            state.isLoading = false;
        },
        SetUser: (state,
                     action: PayloadAction<User | null>) => {
            if (action.payload !== null) {
                state.user = action.payload;
                state.isLogged = true;
                state.isFailed = false;
            }
        },
        RemoveUser: (state) => {
            state = initialState;
        },
        AuthError: (state) => {
            state.isFailed = true;
        }
    }
});

export const {
    AuthStart,
    FinishLoading,
    SetUser,
    RemoveUser,
    AuthError
} = UserSlice.actions;


export default UserSlice.reducer;