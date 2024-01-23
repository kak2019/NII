import { configureStore } from "@reduxjs/toolkit";
import { casesReducer } from "./features/cases/casesSlice";
const store = configureStore({
  reducer: {
    cases: casesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
