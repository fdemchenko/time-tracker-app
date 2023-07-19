import ManageUsers from "../../models/ManageUsers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import User from "../../models/User";

export interface ManageUsersSliceState {
  manageUsers: ManageUsers,
  error: string | null,
  isLoading: boolean
}

const initialState: ManageUsersSliceState = {
  manageUsers: {
    items: [],
    count: 0
  },
  error: null,
  isLoading: false
}

export const ManageUsersSlice = createSlice({
  name: "manageUsers",
  initialState,
  reducers: {
    SetUsers: (state, action: PayloadAction<ManageUsers>) => {
      state.manageUsers = action.payload;
    },
    SetError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    SetLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    SetSendPasswordLink: (state, action: PayloadAction<string>) => {
      state.manageUsers.items = state.manageUsers.items.map((user) =>
        user.email === action.payload ? {...user, hasValidSetPasswordLink: true} : user
      );
    },
    CreateUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload)
        state.manageUsers.items.push(action.payload);
    }
  }
});

export const {
  SetUsers,
  SetError,
  SetLoading,
  SetSendPasswordLink,
  CreateUser
} = ManageUsersSlice.actions;

export default ManageUsersSlice.reducer;