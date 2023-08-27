import UserWorkInfoList from "../../models/UserWorkInfoList";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface UserWorkInfoSliceState {
  userWorkInfoList: UserWorkInfoList,
  excelBytesNumbers: number[],
  error: string | null,
  isLoading: boolean
}

const initialState: UserWorkInfoSliceState = {
  userWorkInfoList: {
    items: [],
    count: 0
  },
  excelBytesNumbers: [],
  error: null,
  isLoading: false
}

export const UserWorkInfoSlice = createSlice({
  name: "userWorkInfo",
  initialState,
  reducers: {
    SetUserWorkInfoList: (state, action: PayloadAction<UserWorkInfoList>) => {
      state.userWorkInfoList = action.payload;
    },
    SetExcelBytesNumbers: (state, action: PayloadAction<number[]>) => {
      state.excelBytesNumbers = action.payload;
    },
    SetError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    SetLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  }
});

export const {
  SetUserWorkInfoList,
  SetExcelBytesNumbers,
  SetLoading,
  SetError
} = UserWorkInfoSlice.actions;

export default UserWorkInfoSlice.reducer;