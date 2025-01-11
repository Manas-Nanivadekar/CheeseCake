import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { logout } from './slices/authSlice';
import orgReducer from './slices/orgSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  org: orgReducer,
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'org', 'user', 'activeOrg'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const logoutAndClearStore = () => {
  store.dispatch(logout());
  persistor.purge();
};
