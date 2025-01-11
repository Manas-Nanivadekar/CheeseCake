import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface OrgState {
  orgName: string;
  orgId: string;
  leaderboard: [];
}

const initialState: OrgState = {
  orgName: "",
  orgId: "",
  leaderboard: [],
};

const orgSlice = createSlice({
  name: "org",
  initialState,
  reducers: {
    setOrgData: (state, action: PayloadAction<OrgState>) => {
      return { ...state, ...action.payload };
    },
    clearOrgData: () => initialState,
  },
});

const persistConfig = {
  key: "org",
  storage,
};

export const { setOrgData, clearOrgData } = orgSlice.actions;
export default persistReducer(persistConfig, orgSlice.reducer);
