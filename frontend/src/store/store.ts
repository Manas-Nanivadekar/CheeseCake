import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import authReducer from "./slices/authSlice";
import orgReducer from "./slices/orgSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
