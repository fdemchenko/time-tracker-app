import ManageUsers from "../../models/ManageUsers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
    }
  }
});

export const {
  SetUsers,
  SetError,
  SetLoading,
  SetSendPasswordLink
} = ManageUsersSlice.actions;

export default ManageUsersSlice.reducer;