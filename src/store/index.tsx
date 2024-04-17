import { configureStore } from "@reduxjs/toolkit";

import { useSelector, useDispatch } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import counterReducer from "../features/counter/counterSlice";
import userReducer from '../features/user/user';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user:userReducer
  },
});
export type IRootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
export default store