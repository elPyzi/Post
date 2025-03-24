import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/AuthSlice';
import citiesReduces from './slices/CitiesSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cities: citiesReduces,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
