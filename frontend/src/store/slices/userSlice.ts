import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface UserState {
  email: string
}


const initialState: UserState = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUserData: () => initialState,
  },
});

const persistConfig = {
  key: 'user',
  storage,
};

export const { setUserData, clearUserData } = userSlice.actions;
export default persistReducer(persistConfig, userSlice.reducer);