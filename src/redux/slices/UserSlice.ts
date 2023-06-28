import User from "../../models/User";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserSliceState {
    user: User
    isLogged: boolean
}
const initialState: UserSliceState = {
    user: {
        id: 1,
        login: "initial login",
        password: "initial password",
        refreshToken: "initial refresh token"
    },
    isLogged: false
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        testAction: (state,
                     action: PayloadAction<User>) => {
            //do some logic example
            state.user = action.payload
        }
    }
});

export const {
    testAction
} = UserSlice.actions;

export default UserSlice.reducer;