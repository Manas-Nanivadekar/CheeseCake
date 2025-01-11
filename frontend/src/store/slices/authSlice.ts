import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { setOrgData } from './orgSlice';
import { setUserData } from './userSlice';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  role: string | null;
  organisationId: string[] | null;
  expiresIn: number | null;
  createdAt: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  role: null,
  organisationId: null,
  expiresIn: null,
  createdAt: null,
};


interface LoginResponse {
  AccessToken: string;
  RefreshToken: string;
  user_id: string;
  role: string;
  organisation_id: string[];
  expiresIn: number;
  createdAt: string;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ loginEmail, loginPass }: { loginEmail: string; loginPass: string }, { dispatch }) => {
    const response = await fetch(`${import.meta.env.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginEmail, loginPass }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json() as LoginResponse;

    // After successful login, fetch additional data using your existing function
    await dispatch(fetchAdditionalData({
      userId: data.user_id,
      accessToken: data.AccessToken
    }));

    return data;
  }
);

export const fetchAdditionalData = createAsyncThunk(
  'auth/fetchAdditionalData',
  async ({ userId, accessToken }: { userId: string; accessToken: string }, { dispatch }) => {
    try {
      console.log(userId, accessToken);
      const orgResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/organisations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!orgResponse.ok) {
        throw new Error(`HTTP error! status: ${orgResponse.status}`);
      }

      const orgData = await orgResponse.json();
      dispatch(setOrgData(orgData));

      const userResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          orgid: "6ce72bae-8ea2-4193-b457-df97889eeba4"
        }
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      dispatch(setUserData(userData));

      return { success: true };
    } catch (error) {
      console.error('Error fetching additional data:', error);
      return { success: false };
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  'auth/refresh',
  async (_, { getState }) => {
    const state: any = getState();
    const refreshToken = state.auth.refreshToken;

    const response = await fetch(`${import.meta.env.BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      return { ...state, ...action.payload };
    },
    clearCredentials: () => initialState,
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.AccessToken;
        state.refreshToken = action.payload.RefreshToken;
        state.userId = action.payload.user_id;
        state.role = action.payload.role;
        state.organisationId = action.payload.organisation_id;
        state.expiresIn = action.payload.expiresIn;
        state.createdAt = action.payload.createdAt;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.AccessToken;
        state.expiresIn = action.payload.expiresIn;
      });
  },
});

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['accessToken', 'refreshToken', 'userId', 'role', 'organisationId', 'expiresIn', 'createdAt'],
};

export const { setCredentials, clearCredentials, logout } = authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);