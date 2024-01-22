import { useCallback } from "react";
import {
  editPackagingAction,
  fetchPackagingsByCaseAction,
  removePackagingByIdAction,
} from "../features/packagingneeds/action";
import { PackagingStatus } from "../features/packagingneeds/packagingSlice";
import {
  isFetchingSelector,
  messageSelector,
  packagesSelector,
} from "../features/packagingneeds/selector";
import { IPackaging } from "../model/packagingneed";
import { useAppDispatch, useAppSelector } from "./useApp";

type PackagingsOperators = [
  isFetching: PackagingStatus,
  errorMessage: string,
  packages: IPackaging[],
  fetchPackagingsByCase: (Id: number) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editPackaging: (arg: { Packaging: any }) => Promise<number>,
  removePackagingById: (arg: { Id: number }) => Promise<number>
];

export const usePackagings = (): Readonly<PackagingsOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const packages = useAppSelector(packagesSelector);
  const fetchPackagingsByCase = useCallback(
    (CaseId: number) => {
      return dispatch(fetchPackagingsByCaseAction({ CaseId }));
    },
    [dispatch]
  );
  const editPackaging = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (arg: { Packaging: any }) => {
      try {
        await dispatch(editPackagingAction(arg));
        return 0;
      } catch {
        return Promise.reject(1);
      }
    },
    [dispatch]
  );
  const removePackagingById = useCallback(
    async (arg: { Id: number }) => {
      try {
        await dispatch(removePackagingByIdAction(arg));
        return 0;
      } catch {
        return Promise.reject(1);
      }
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    packages,
    fetchPackagingsByCase,
    editPackaging,
    removePackagingById,
  ];
};
