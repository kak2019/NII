import { useCallback } from "react";
import {
  CaseItemIdChanged,
  CaseStatus,
  CurrentUserEmailChanged,
} from "../features/cases/casesSlice";
import {
  consequensesSelector,
  contractFilesSelector,
  countryCodesSelector,
  currentCaseIdSelector,
  currentCaseSelector,
  currentUserEmailSelector,
  isFetchingSelector,
  messageSelector,
  originalFilesSelector,
  packagingDataSelector,
  packagingNeedsSelector,
  receivingPlantSelector,
  userRolesSelector,
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
  fetchCountryDataAction,
  fetchOriginalFileByIdAction,
  fetchPackagingDataAction,
  fetchPackagingNeedsByCaseAction,
  fetchReceivingPlantByCaseAction,
  fetchUserGroupsAction,
  removePackagingNeedsByIdAction,
  uploadFileAction,
} from "../features/cases/action";
import { IPackaging } from "../model/packagingneed";
import { IPackagingData } from "../model/packagingdata";
import { IFileInfo } from "@pnp/sp/files";
import { RcFile } from "antd/lib/upload";
import { IOption } from "../model/option";

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
  countryCodes: IOption[],
  userRoles: string[],
  currentUserEmail: string,
  initialCaseForm: (Id: number, UserEmail: string) => void,
  changeCaseId: (Id: string) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editCase: (arg: { niiCase: any }) => Promise<number>,
  editPackagingNeed: (arg: { Packaging: IPackaging }) => void,
  addPackagingNeed: (arg: { Packaging: IPackaging }) => void,
  removePackagingNeedsById: (Id: number) => void,
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
  const countryCodes = useAppSelector(countryCodesSelector);
  const userRoles = useAppSelector(userRolesSelector);
  const currentUserEmail = useAppSelector(currentUserEmailSelector);

  const initialCaseForm = useCallback(
    async (Id: number, UserEmail: string) => {
      const dispatchActions = async (): Promise<void> => {
        dispatch(CaseItemIdChanged(Id));
        dispatch(CurrentUserEmailChanged(UserEmail));
        await dispatch(fetchByIdAction({ Id }));
        await dispatch(fetchConsequensesByCaseAction({ CaseId: Id }));
        await dispatch(fetchPackagingNeedsByCaseAction({ CaseId: Id }));
        await dispatch(fetchReceivingPlantByCaseAction({ CaseId: Id }));
        await dispatch(fetchContractFileByIdAction({ Id }));
        await dispatch(fetchContractFileByIdAction({ Id }));
        await dispatch(fetchOriginalFileByIdAction({ Id }));
        await dispatch(fetchPackagingDataAction());
        await dispatch(fetchCountryDataAction());
        await dispatch(fetchUserGroupsAction({ userEmail: UserEmail }));
      };
      await dispatchActions();
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
    countryCodes,
    userRoles,
    currentUserEmail,
    initialCaseForm,
    changeCaseId,
    editCase,
    editPackagingNeed,
    addPackagingNeed,
    removePackagingNeedsById,
    uploadFile,
  ];
};
