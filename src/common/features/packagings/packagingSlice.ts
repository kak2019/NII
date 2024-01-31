import { createSlice } from "@reduxjs/toolkit";
import { IPackaging } from "../../model/packagingneed";
import { RootState } from "../../store";
import { fetchPackagingNeedsAction } from "./action";

export enum PackagingStatus {
  Idle,
  Loading,
  Failed,
}
export interface IPackagingState {
  packagingNeeds: IPackaging[];
  statue: PackagingStatus;
  message: string;
}
const initialState: IPackagingState = {
  packagingNeeds: [],
  statue: PackagingStatus.Idle,
  message: "",
};
export const packagingSlice = createSlice({
  name: "packaging",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
