import { configureStore } from '@reduxjs/toolkit';
import { hotelReducer } from './slices';

export const store = configureStore({
  reducer: {
    hotel: hotelReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
