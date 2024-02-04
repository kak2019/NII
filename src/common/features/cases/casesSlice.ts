import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { INiiCaseItem } from "../../model/niicase";
import { IReceivingPlant } from "../../model/receivingplant";
import { IConsequense } from "../../model/consequense";
import {
  addPackagingNeedAction,
  editCaseAction,
  editPackagingNeedAction,
  fetchByIdAction,
  fetchConsequensesByCaseAction,
  fetchContractFileByIdAction,
  fetchOriginalFileByIdAction,
  fetchPackagingDataAction,
  fetchPackagingNeedsByCaseAction,
  fetchReceivingPlantByCaseAction,
  removePackagingNeedsByIdAction,
  uploadFileAction,
} from "./action";
import { IPackaging } from "../../model/packagingneed";
import { IPackagingData } from "../../model/packagingdata";
import { IFileInfo } from "@pnp/sp/files";

export enum CaseStatus {
  Idle,
  Loading,
  Failed,
}
// Define a type for the slice state
export interface ICaseState {
  currentCaseId: string;
  currentCase: INiiCaseItem;
  packagingNeeds: IPackaging[];
  receivingPlant: IReceivingPlant[];
  consequenses: IConsequense[];
  statue: CaseStatus;
  message: string;
  packagingData: IPackagingData[];
  contractFiles: IFileInfo[];
  originalFiles: IFileInfo[];
}

// Define the initial state using that type
const initialState: ICaseState = {
  currentCaseId: "-1",
  currentCase: {},
  packagingNeeds: [],
  receivingPlant: [],
  consequenses: [],
  statue: CaseStatus.Idle,
  message: "",
  packagingData: [],
  contractFiles: [],
  originalFiles: [],
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
      })
      .addCase(fetchPackagingNeedsByCaseAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(fetchPackagingNeedsByCaseAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.packagingNeeds = action.payload as IPackaging[];
      })
      .addCase(fetchPackagingNeedsByCaseAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
        state.message = action.error?.message;
      })
      .addCase(editPackagingNeedAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(editPackagingNeedAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
      })
      .addCase(editPackagingNeedAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
      })
      .addCase(removePackagingNeedsByIdAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(removePackagingNeedsByIdAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
      })
      .addCase(removePackagingNeedsByIdAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
      })
      .addCase(fetchReceivingPlantByCaseAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(fetchReceivingPlantByCaseAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.receivingPlant = action.payload as IReceivingPlant[];
      })
      .addCase(fetchReceivingPlantByCaseAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
        state.message = action.error?.message;
      })
      .addCase(addPackagingNeedAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(addPackagingNeedAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
      })
      .addCase(addPackagingNeedAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
      })
      .addCase(fetchPackagingDataAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(fetchPackagingDataAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.packagingData = action.payload;
      })
      .addCase(fetchPackagingDataAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
      })
      .addCase(fetchContractFileByIdAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(fetchContractFileByIdAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.contractFiles = action.payload;
      })
      .addCase(fetchContractFileByIdAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
      })
      .addCase(fetchOriginalFileByIdAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(fetchOriginalFileByIdAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
        state.originalFiles = action.payload;
      })
      .addCase(fetchOriginalFileByIdAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
      })
      .addCase(uploadFileAction.pending, (state, action) => {
        state.statue = CaseStatus.Loading;
      })
      .addCase(uploadFileAction.fulfilled, (state, action) => {
        state.statue = CaseStatus.Idle;
      })
      .addCase(uploadFileAction.rejected, (state, action) => {
        state.statue = CaseStatus.Failed;
      });
  },
});

export const CASECONST = Object.freeze({
  CASE_LIST: "Nii Cases",
  CONSEQUENSES_LIST: "Consequenses List",
  PACKAGING_LIST: "Packaging List",
  LIBRARY_NAME: "Nii Case Library",
  CONTRACT_TYPE: "Contract File",
  RECEIVING_LIST: "Receiving Plant/Receiver",
  PACKAGING_DATA_LIST: "Packaging Data",
  UPLOAD_FILE: "uploadFile",
});

export const { CaseItemIdChanged } = caseSlice.actions;
// Other code such as selectors can use the imported `RootState` type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectCases = (state: RootState) => state.cases;
export const casesReducer = caseSlice.reducer;
