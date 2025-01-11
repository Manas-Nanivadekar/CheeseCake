import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface OrgState {

}

const initialState: OrgState = {
  
};


const orgSlice = createSlice({
  name: 'org',
  initialState,
  reducers: {
    setOrgData: (state, action: PayloadAction<OrgState['organisations']>) => {
      state.organisations = action.payload;
    },
    clearOrgData: () => initialState,
  },
});

const persistConfig = {
  key: 'org',
  storage,
};

export const { setOrgData, clearOrgData } = orgSlice.actions;
export default persistReducer(persistConfig, orgSlice.reducer);