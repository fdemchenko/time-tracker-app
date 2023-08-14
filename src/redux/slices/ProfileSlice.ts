import ProfileList from "../../models/ProfileList";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ProfileSliceState {
  profiles: ProfileList,
  error: string | null,
  isLoading: boolean
}

const initialState: ProfileSliceState = {
  profiles: {
    items: [],
    count: 0
  },
  error: null,
  isLoading: false
}

export const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    SetProfiles: (state, action: PayloadAction<ProfileList>) => {
      state.profiles = action.payload;
    },
    SetError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    SetLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  }
});

export const {
  SetProfiles,
  SetLoading,
  SetError
} = ProfileSlice.actions;

export default ProfileSlice.reducer;