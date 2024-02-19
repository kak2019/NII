import { createSlice } from "@reduxjs/toolkit";
import { IPackaging } from "../../model/packagingneed";
import { RootState } from "../../store";
import {
  fetchAllPackagingNeedsAction,
  fetchPackagingNeedsAction,
  fetchSupplierNameByParmaAction,
} from "./action";

export enum PackagingStatus {
  Idle,
  Loading,
  Failed,
}
export interface IPackagingState {
  packagingNeeds: IPackaging[];
  statue: PackagingStatus;
  message: string;
  supplierNameResult: string;
}
const initialState: IPackagingState = {
  packagingNeeds: [],
  statue: PackagingStatus.Idle,
  message: "",
  supplierNameResult: "",
};
export const packagingSlice = createSlice({
  name: "packaging",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPackagingNeedsAction.pending, (state, action) => {
        state.statue = PackagingStatus.Loading;
      })
      .addCase(fetchAllPackagingNeedsAction.fulfilled, (state, action) => {
        state.statue = PackagingStatus.Idle;
        state.packagingNeeds = action.payload as IPackaging[];
      })
      .addCase(fetchAllPackagingNeedsAction.rejected, (state, action) => {
        state.statue = PackagingStatus.Failed;
        state.message = action.error?.message;
      })
      .addCase(fetchSupplierNameByParmaAction.pending, (state, action) => {
        state.statue = PackagingStatus.Loading;
      })
      .addCase(fetchSupplierNameByParmaAction.fulfilled, (state, action) => {
        state.statue = PackagingStatus.Idle;
        state.supplierNameResult = action.payload as string;
      })
      .addCase(fetchSupplierNameByParmaAction.rejected, (state, action) => {
        state.statue = PackagingStatus.Failed;
        state.message = action.error?.message;
      })
      .addCase(fetchPackagingNeedsAction.pending, (state, action) => {
        state.statue = PackagingStatus.Loading;
      })
      .addCase(fetchPackagingNeedsAction.fulfilled, (state, action) => {
        state.statue = PackagingStatus.Idle;
        state.packagingNeeds = action.payload as IPackaging[];
      })
      .addCase(fetchPackagingNeedsAction.rejected, (state, action) => {
        state.statue = PackagingStatus.Failed;
        state.message = action.error?.message;
      });
  },
});
export const PACKAGINGCONST = Object.freeze({
  PACKAGING_LIST: "Packaging List",
});

// eslint-disable-next-line no-empty-pattern
export const {} = packagingSlice.actions;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectPackagings = (state: RootState) => state.packagings;
export const packagingsReducer = packagingSlice.reducer;
