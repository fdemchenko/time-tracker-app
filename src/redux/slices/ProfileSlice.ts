import ProfileList from "../../models/ProfileList";
import Profile from "../../models/Profile";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ProfileSliceState {
  profiles: ProfileList,
  profile: Profile | null,
  error: string | null,
  isLoading: boolean
}

const initialState: ProfileSliceState = {
  profiles: {
    items: [],
    count: 0
  },
  profile: null,
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
    SetProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
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
  SetProfiles,
  SetLoading,
  SetProfile,
  SetError
} = ProfileSlice.actions;

export default ProfileSlice.reducer;