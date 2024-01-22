import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ICaseState } from "./casesSlice";

const featureStateSelector = (state: RootState): object => state.cases;

export const isFetchingSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.statue
);
export const currentCaseIdSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.currentCaseId
);
export const currentCaseSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.currentCase
);
export const packagesSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.packages
);
export const receivingPlantSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.receivingPlant
);
export const consequensesSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.consequenses
);
export const messageSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.message
);
