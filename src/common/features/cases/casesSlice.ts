import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { IPackagingNeed } from "../../model/packagingneed";
import { INiiCaseItem } from "../../model/niicase";
import { IReceivingPlant } from "../../model/receivingplant";
import { IConsequense } from "../../model/consequense";
import {
  editCaseAction,
  fetchByIdAction,
  fetchConsequensesByCaseAction,
} from "./action";

export enum CaseStatus {
  Idle,
  Loading,
  Failed,
}
// Define a type for the slice state
export interface ICaseState {
  currentCaseId: string;
  currentCase: INiiCaseItem;
  packages: IPackagingNeed[];
  packageYear: number;
  packageEditable: boolean;
  selectedPackages: IPackagingNeed[];
  receivingPlant: IReceivingPlant[];
  consequenses: IConsequense[];
  statue: CaseStatus;
  message: string;
}

// Define the initial state using that type
const initialState: ICaseState = {
  currentCaseId: "-1",
  currentCase: {},
  packages: [],
  packageYear: new Date().getFullYear(),
  packageEditable: true,
  selectedPackages: [],
  receivingPlant: [],
  consequenses: [],
  statue: CaseStatus.Idle,
  message: "",
};

export const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    CaseItemIdChanged(state, action) {
      state.currentCaseId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchByIdAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(fetchByIdAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.currentCase = action.payload as INiiCaseItem;
      })
      .addCase(fetchByIdAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
        state.message = action.error?.message;
      })
      .addCase(editCaseAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(editCaseAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.currentCase = action.payload as INiiCaseItem;
      })
      .addCase(editCaseAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
        state.message = action.error?.message;
      })
      .addCase(fetchConsequensesByCaseAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(fetchConsequensesByCaseAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.consequenses = action.payload as IConsequense[];
      })
      .addCase(fetchConsequensesByCaseAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
        state.message = action.error?.message;
      });
  },
});

export const { CaseItemIdChanged } = caseSlice.actions;
// Other code such as selectors can use the imported `RootState` type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectCases = (state: RootState) => state.cases;
export const casesReducer = caseSlice.reducer;
