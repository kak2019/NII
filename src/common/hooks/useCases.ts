import { useCallback } from "react";
import { CaseItemIdChanged, CaseStatus } from "../features/cases/casesSlice";
import {
  consequensesSelector,
  currentCaseIdSelector,
  currentCaseSelector,
  isFetchingSelector,
  messageSelector,
  packagingNeedsSelector,
  receivingPlantSelector,
} from "../features/cases/selector";
import { IConsequense } from "../model/consequense";
import { INiiCaseItem } from "../model/niicase";
import { IReceivingPlant } from "../model/receivingplant";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  editCaseAction,
  editPackagingNeedAction,
  fetchByIdAction,
  fetchConsequensesByCaseAction,
  fetchPackagingNeedsByCaseAction,
  removePackagingNeedsByIdAction,
} from "../features/cases/action";
import { IPackaging } from "../model/packagingneed";

type CasesOperators = [
  isFetching: CaseStatus,
  errorMessage: string,
  currentCase: INiiCaseItem,
  currentCaseId: string,
  packagingNeeds: IPackaging[],
  receivingPlant: IReceivingPlant[],
  consequenses: IConsequense[],
  changeCaseId: (Id: string) => void,
  fetchCaseById: (Id: number) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editCase: (arg: { niiCase: any }) => Promise<number>,
  fetchConsequensesByCase: (Id: number) => void,
  fetchPackagingNeedsByCase: (CaseId: number) => void,
  editPackagingNeed: (arg: { Packaging: IPackaging }) => void,
  removePackagingNeedsById: (Id: number) => void
];
export const useCases = (): Readonly<CasesOperators> => {
  const dispatch = useAppDispatch();
  const currentCase = useAppSelector(currentCaseSelector);
  const currentCaseId = useAppSelector(currentCaseIdSelector);
  const packagingNeeds = useAppSelector(packagingNeedsSelector);
  const receivingPlant = useAppSelector(receivingPlantSelector);
  const consequenses = useAppSelector(consequensesSelector);
  const isFetching = useAppSelector(isFetchingSelector);
  const errorMessage = useAppSelector(messageSelector);

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
  const removePackagingNeedsById = useCallback(
    (Id: number) => {
      return dispatch(removePackagingNeedsByIdAction({ Id }));
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
    changeCaseId,
    fetchCaseById,
    editCase,
    fetchConsequensesByCase,
    fetchPackagingNeedsByCase,
    editPackagingNeed,
    removePackagingNeedsById,
  ];
};
