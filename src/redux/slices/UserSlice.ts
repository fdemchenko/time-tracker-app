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
        id: "",
        email: "",
        fullName: "",
        employmentRate: 0,
        status: "",
        permissions: ""
    },
    isLogged: false,
    isFailed: false,
    isLoading: false
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        RequestStart: (state) => {
            state.isLogged = false;
            state.isFailed = false;
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
                state.isFailed = false;
            }
        },
        RemoveUser: (state) => {
            state = initialState;
        },
        SetError: (state) => {
            state.isFailed = true;
        }
    }
});

export const {
    RequestStart,
    RequestFinish,
    SetUser,
    RemoveUser,
    SetError
} = UserSlice.actions;


export default UserSlice.reducer;