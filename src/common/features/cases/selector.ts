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
export const packageYearSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.packageYear
);
export const packageEditableSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.packageEditable
);
export const selectedPackagesSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.selectedPackages
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
