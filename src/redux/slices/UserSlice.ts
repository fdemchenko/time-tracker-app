import User from "../../models/User";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserSliceState {
    user: User
    isLogged: boolean
}
const initialState: UserSliceState = {
    user: {
        id: "guid id",
        login: "initial login",
    },
    isLogged: true
}

export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        testAction: (state,
                     action: PayloadAction<any>) => {
            //do some logic example
            //state.user = action.payload
            console.log(action.payload)
        }
    }
});

export const {
    testAction
} = UserSlice.actions;

export default UserSlice.reducer;