import { configureStore } from "@reduxjs/toolkit";
import { casesReducer } from "./features/cases/casesSlice";
// import { distributionsReducer } from "./features/distributions";
// import { entitiesReducer } from "./features/entities";
// import { requestsReducer } from "./features/requests";
// import { requestsReducerbundle } from "./features/requestsBundlelist";

const store = configureStore({
  reducer: {
    cases: casesReducer,
    // entities: entitiesReducer,
    // requests: requestsReducer,
    // distributions: distributionsReducer,
    // requestsV2:requestsReducerbundle
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
