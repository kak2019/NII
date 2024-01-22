import { createSlice } from "@reduxjs/toolkit";
import { IPackaging } from "../../model/packagingneed";
import { fetchPackagingsByCaseAction } from "./action";

export enum PackagingStatus {
  Idle,
  Loading,
  Failed,
}

export interface IPackagingState {
  packages: IPackaging[];
  statue: PackagingStatus;
  message: string;
}

const initialState: IPackagingState = {
  packages: [],
  statue: PackagingStatus.Idle,
  message: "",
};

export const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackagingsByCaseAction.pending, (state, action) => {
        state.statue = PackagingStatus.Loading;
      })
      .addCase(fetchPackagingsByCaseAction.fulfilled, (state, action) => {
        state.statue = PackagingStatus.Idle;
        state.packages = action.payload as IPackaging[];
      })
      .addCase(fetchPackagingsByCaseAction.rejected, (state, action) => {
        state.statue = PackagingStatus.Failed;
        state.message = action.error?.message;
      });
  },
});
