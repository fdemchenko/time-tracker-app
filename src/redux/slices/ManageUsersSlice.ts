import ManageUsers from "../../models/ManageUsers";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import User from "../../models/User";

export interface ManageUsersSliceState {
  manageUsers: ManageUsers,
  recentlyCreatedUsers: User[],
  usersWithoutPagination: User[],
  error: string | null,
  isLoading: boolean
}

const initialState: ManageUsersSliceState = {
  manageUsers: {
    items: [],
    count: 0
  },
  recentlyCreatedUsers: [],
  usersWithoutPagination: [],
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
    SetError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    SetUsersWithoutPagination: (state, action: PayloadAction<User[]>) => {
      state.usersWithoutPagination = action.payload;
      state.error = null;
    },
    SetUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    SetSendPasswordLink: (state, action: PayloadAction<string>) => {
      state.manageUsers.items = state.manageUsers.items.map((user) =>
        user.email === action.payload ? {...user, hasValidSetPasswordLink: true} : user
      );

      state.recentlyCreatedUsers = state.recentlyCreatedUsers.map((user) =>
        user.email === action.payload ? {...user, hasValidSetPasswordLink: true} : user
      );
    },
    FireUser: (state, action: PayloadAction<string>) => {
      state.manageUsers.items = state.manageUsers.items.map((user) =>
        user.id === action.payload ? { ...user, status: 'deactivated' } : user
      );

      state.recentlyCreatedUsers = state.recentlyCreatedUsers.map((user) =>
        user.id === action.payload ? { ...user, status: 'deactivated' } : user
      );
    },
    CreateUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.recentlyCreatedUsers.push(action.payload);
      }
    },
    UpdateUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.manageUsers.items = state.manageUsers.items.map(item => {
          if (item.id !== action.payload?.id) {
            return item;
          }

          return {
            ...item,
            ...action.payload
          };
        });

        state.recentlyCreatedUsers = state.recentlyCreatedUsers.map(item => {
          if (item.id !== action.payload?.id) {
            return item;
          }

          return {
            ...item,
            ...action.payload
          };
        })
      }
    }
  }
});

export const {
  SetUsers,
  SetError,
  SetUserLoading,
  SetSendPasswordLink,
  SetUsersWithoutPagination,
  CreateUser,
  UpdateUser,
  FireUser
} = ManageUsersSlice.actions;

export default ManageUsersSlice.reducer;