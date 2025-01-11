import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface UserState {
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  orgName: string;
  rank: number;
  courses: [];
  logged_in: boolean;
}

const initialState: UserState = {
  email: "",
  password: "",
  role: "USER",
  orgName: "",
  rank: 0,
  courses: [],
  logged_in: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUserData: () => initialState,
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.logged_in = action.payload;
    },
  },
});

const persistConfig = {
  key: "user",
  storage,
};

export const { setUserData, clearUserData, setLoggedIn } = userSlice.actions;
export default persistReducer(persistConfig, userSlice.reducer);
