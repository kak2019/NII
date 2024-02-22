import { useCallback } from "react";
import {
  isFetchingSelector,
  messageSelector,
  packagingNeedsAllSelector,
  packagingNeedsSelector,
  supplierNameResultSelector,
} from "../features/packagings/selector";
import { IPackaging } from "../model/packagingneed";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  fetchAllPackagingNeedsAction,
  fetchPackagingNeedsAction,
  fetchSupplierNameByParmaAction,
} from "../features/packagings/action";
import {
  ClearData,
  PackagingStatus,
} from "../features/packagings/packagingSlice";

type PackagingsOperators = [
  isFetching: PackagingStatus,
  errorMessage: string,
  packagingNeeds: IPackaging[],
  packagingNeedsAll: IPackaging[],
  supplierNameResult: string,
  fetchAllPackagingNeeds: () => void,
  fetchSupplierNameByParma: (ParmaNum: string) => void,
  fetchAPackagingNeeds: (
    ParmaNum: string,
    Year: string,
    CaseID: string
  ) => void,
  clearAllData: () => void
];

export const usePackagings = (): Readonly<PackagingsOperators> => {
  const dispatch = useAppDispatch();
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const packagingNeeds = useAppSelector(packagingNeedsSelector);
  const packagingNeedsAll = useAppSelector(packagingNeedsAllSelector);
  const supplierNameResult = useAppSelector(supplierNameResultSelector);

  const fetchAllPackagingNeeds = useCallback(() => {
    return dispatch(fetchAllPackagingNeedsAction());
  }, [dispatch]);
  const fetchSupplierNameByParma = useCallback(
    (ParmaNum: string) => {
      return dispatch(fetchSupplierNameByParmaAction({ ParmaNum }));
    },
    [dispatch]
  );
  const fetchPackagingNeeds = useCallback(
    (ParmaNum: string, Year: string, CaseID: string) => {
      return dispatch(fetchPackagingNeedsAction({ ParmaNum, Year, CaseID }));
    },
    [dispatch]
  );
  const clearAllData = useCallback(() => {
    return dispatch(ClearData());
  }, [dispatch]);
  return [
    isFetching,
    errorMessage,
    packagingNeeds,
    packagingNeedsAll,
    supplierNameResult,
    fetchAllPackagingNeeds,
    fetchSupplierNameByParma,
    fetchPackagingNeeds,
    clearAllData,
  ];
};
