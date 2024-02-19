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
export const packagingNeedsSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.packagingNeeds
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
export const packagingDataSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.packagingData
);
export const contractFilesSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.contractFiles
);
export const originalFilesSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.originalFiles
);
export const countryCodesSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.countryCodes
);
export const userRolesSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.userRoles
);
export const currentUserEmailSelector = createSelector(
  featureStateSelector,
  (state: ICaseState) => state?.currentUserEmail
);
