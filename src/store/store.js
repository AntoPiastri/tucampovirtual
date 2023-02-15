import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import {persistReducer, FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER,} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import { setupListeners } from '@reduxjs/toolkit/query'


const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: ['apiProductSlice'],
  }
  export const rootReducers = combineReducers({
    auth: authSlice.reducer,
  })
  const persistedReducer = persistReducer(persistConfig, rootReducers)

export const store = configureStore ({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware({serializableCheck: {ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],},})
    
})

setupListeners(store.dispatch)

    