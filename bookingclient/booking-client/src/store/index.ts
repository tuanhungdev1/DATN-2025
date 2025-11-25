import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import { baseApi } from "@/services/api.service";
import toastReducer from "./slices/toastSlice";
import paymentReducer from "./slices/paymentManagementSlice";
import couponReducer from "./slices/couponManagementSlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { persistStore } from "redux-persist";
import userManagementReducer from "./slices/userManagementSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    userManagement: userManagementReducer,
    toast: toastReducer,
    myPayment: paymentReducer,
    coupon: couponReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
