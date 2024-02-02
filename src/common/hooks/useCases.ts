import { useCallback } from "react";
import { CaseItemIdChanged, CaseStatus } from "../features/cases/casesSlice";
import {
  consequensesSelector,
  contractFilesSelector,
  currentCaseIdSelector,
  currentCaseSelector,
  isFetchingSelector,
  messageSelector,
  originalFilesSelector,
  packagingDataSelector,
  packagingNeedsSelector,
  receivingPlantSelector,
} from "../features/cases/selector";
import { IConsequense } from "../model/consequense";
import { INiiCaseItem } from "../model/niicase";
import { IReceivingPlant } from "../model/receivingplant";
import { useAppDispatch, useAppSelector } from "./useApp";
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
} from "../features/cases/action";
import { IPackaging } from "../model/packagingneed";
import { IPackagingData } from "../model/packagingdata";
import { IFileInfo } from "@pnp/sp/files";
import { RcFile } from "antd/lib/upload";

type CasesOperators = [
  isFetching: CaseStatus,
  errorMessage: string,
  currentCase: INiiCaseItem,
  currentCaseId: string,
  packagingNeeds: IPackaging[],
  receivingPlant: IReceivingPlant[],
  consequenses: IConsequense[],
  packagingData: IPackagingData[],
  contractFiles: IFileInfo[],
  originalFiles: IFileInfo[],
  initialCaseForm: (Id: number) => void,
  changeCaseId: (Id: string) => void,
  fetchCaseById: (Id: number) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editCase: (arg: { niiCase: any }) => Promise<number>,
  fetchConsequensesByCase: (Id: number) => void,
  fetchPackagingNeedsByCase: (CaseId: number) => void,
  editPackagingNeed: (arg: { Packaging: IPackaging }) => void,
  addPackagingNeed: (arg: { Packaging: IPackaging }) => void,
  removePackagingNeedsById: (Id: number) => void,
  fetchReceivingPlantByCase: (Id: number) => void,
  fetchPackagingData: () => void,
  fetchContractFileById: (Id: number) => void,
  fetchOriginalFileById: (Id: number) => void,
  uploadFile: (
    newFile: RcFile[],
    replace: boolean,
    oldFileUrl: string,
    caseId: string
  ) => void
];
export const useCases = (): Readonly<CasesOperators> => {
  const dispatch = useAppDispatch();
  const currentCase = useAppSelector(currentCaseSelector);
  const currentCaseId = useAppSelector(currentCaseIdSelector);
  const packagingNeeds = useAppSelector(packagingNeedsSelector);
  const receivingPlant = useAppSelector(receivingPlantSelector);
  const consequenses = useAppSelector(consequensesSelector);
  const packagingData = useAppSelector(packagingDataSelector);
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);
  const contractFiles = useAppSelector(contractFilesSelector);
  const originalFiles = useAppSelector(originalFilesSelector);

  const initialCaseForm = useCallback(
    async (Id: number) => {
      const dispatchActions = async (): Promise<void> => {
        dispatch(CaseItemIdChanged(Id));
        await dispatch(fetchByIdAction({ Id }));
        await dispatch(fetchConsequensesByCaseAction({ CaseId: Id }));
        await dispatch(fetchPackagingNeedsByCaseAction({ CaseId: Id }));
        await dispatch(fetchReceivingPlantByCaseAction({ CaseId: Id }));
        await dispatch(fetchContractFileByIdAction({ Id }));
        await dispatch(fetchContractFileByIdAction({ Id }));
        await dispatch(fetchOriginalFileByIdAction({ Id }));
        await dispatch(fetchPackagingDataAction());
      };
      await dispatchActions();
    },
    [dispatch]
  );
  const fetchCaseById = useCallback(
    (Id: number) => {
      dispatch(CaseItemIdChanged(Id));
      return dispatch(fetchByIdAction({ Id }));
    },
    [dispatch]
  );
  const editCase = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (arg: { niiCase: any }) => {
      try {
        await dispatch(editCaseAction(arg));
        return 0;
      } catch {
        return Promise.reject(1);
      }
    },
    [dispatch]
  );
  const changeCaseId = useCallback(
    (Id: string) => {
      return dispatch(CaseItemIdChanged(Id));
    },
    [dispatch]
  );
  const fetchConsequensesByCase = useCallback(
    (CaseId: number) => {
      dispatch(CaseItemIdChanged(CaseId));
      return dispatch(fetchConsequensesByCaseAction({ CaseId }));
    },
    [dispatch]
  );
  const fetchPackagingNeedsByCase = useCallback(
    (CaseId: number) => {
      dispatch(CaseItemIdChanged(CaseId));
      return dispatch(fetchPackagingNeedsByCaseAction({ CaseId }));
    },
    [dispatch]
  );
  const editPackagingNeed = useCallback(
    (arg: { Packaging: IPackaging }) => {
      return dispatch(editPackagingNeedAction(arg));
    },
    [dispatch]
  );
  const addPackagingNeed = useCallback(
    (arg: { Packaging: IPackaging }) => {
      return dispatch(addPackagingNeedAction(arg));
    },
    [dispatch]
  );
  const removePackagingNeedsById = useCallback(
    (Id: number) => {
      return dispatch(removePackagingNeedsByIdAction({ Id }));
    },
    [dispatch]
  );
  const fetchReceivingPlantByCase = useCallback(
    (CaseId: number) => {
      dispatch(CaseItemIdChanged(CaseId));
      return dispatch(fetchReceivingPlantByCaseAction({ CaseId }));
    },
    [dispatch]
  );
  const fetchPackagingData = useCallback(() => {
    return dispatch(fetchPackagingDataAction());
  }, [dispatch]);
  const fetchContractFileById = useCallback(
    (Id: number) => {
      return dispatch(fetchContractFileByIdAction({ Id }));
    },
    [dispatch]
  );
  const fetchOriginalFileById = useCallback(
    (Id: number) => {
      return dispatch(fetchOriginalFileByIdAction({ Id }));
    },
    [dispatch]
  );
  const uploadFile = useCallback(
    (
      newFile: RcFile[],
      replace: boolean,
      oldFileUrl: string,
      caseId: string
    ) => {
      return dispatch(
        uploadFileAction({ newFile, replace, oldFileUrl, caseId })
      );
    },
    [dispatch]
  );
  return [
    isFetching,
    errorMessage,
    currentCase,
    currentCaseId,
    packagingNeeds,
    receivingPlant,
    consequenses,
    packagingData,
    contractFiles,
    originalFiles,
    initialCaseForm,
    changeCaseId,
    fetchCaseById,
    editCase,
    fetchConsequensesByCase,
    fetchPackagingNeedsByCase,
    editPackagingNeed,
    addPackagingNeed,
    removePackagingNeedsById,
    fetchReceivingPlantByCase,
    fetchPackagingData,
    fetchContractFileById,
    fetchOriginalFileById,
    uploadFile,
  ];
};
