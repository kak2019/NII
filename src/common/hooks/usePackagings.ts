import { useCallback } from "react";
import {
  isFetchingSelector,
  messageSelector,
  packagingNeedsSelector,
} from "../features/packagings/selector";
import { IPackaging } from "../model/packagingneed";
import { useAppDispatch, useAppSelector } from "./useApp";
import { fetchPackagingNeedsAction } from "../features/packagings/action";
import { PackagingStatus } from "../features/packagings/packagingSlice";

type PackagingsOperators = [
  isFetching: PackagingStatus,
  errorMessage: string,
  packagingNeeds: IPackaging[],
  fetchPackagingNeeds: () => void
];

export const usePackagings = (): Readonly<PackagingsOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const packagingNeeds = useAppSelector(packagingNeedsSelector);

  const fetchPackagingNeeds = useCallback(() => {
    return dispatch(fetchPackagingNeedsAction());
  }, [dispatch]);

  return [isFetching, errorMessage, packagingNeeds, fetchPackagingNeeds];
};
