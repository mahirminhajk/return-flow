import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";

const persistConfig = {
  key: "root",
  storage,
};

//* The persistedReducer is the userReducer wrapped in the persistReducer function
const persistedReducer = persistReducer(persistConfig, userReducer);

//* The store is created with the persistedReducer
export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  //? To fix the error, we need to add the serializableCheck option to the middleware configuration.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;