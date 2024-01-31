import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { IPackagingState } from "./packagingSlice";

const featureStateSelector = (state: RootState): object => state.packagings;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: IPackagingState) => state?.statue
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: IPackagingState) => state?.message
);
export const packagingNeedsSelector = createSelector(
  featureStateSelector,
  (state: IPackagingState) => state?.packagingNeeds
);
