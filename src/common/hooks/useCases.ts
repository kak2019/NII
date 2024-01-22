import { useCallback } from "react";
import { CaseItemIdChanged, CaseStatus } from "../features/cases/casesSlice";
import {
  consequensesSelector,
  currentCaseIdSelector,
  currentCaseSelector,
  isFetchingSelector,
  messageSelector,
  packageEditableSelector,
  packageYearSelector,
  packagesSelector,
  receivingPlantSelector,
  selectedPackagesSelector,
} from "../features/cases/selector";
import { IConsequense } from "../model/consequense";
import { INiiCaseItem } from "../model/niicase";
import { IPackagingNeed } from "../model/packagingneed";
import { IReceivingPlant } from "../model/receivingplant";
import { useAppDispatch, useAppSelector } from "./useApp";
import {
  editCaseAction,
  fetchByIdAction,
  fetchConsequensesByCaseAction,
} from "../features/cases/action";

type CasesOperators = [
  isFetching: CaseStatus,
  errorMessage: string,
  currentCase: INiiCaseItem,
  currentCaseId: string,
  packages: IPackagingNeed[],
  packageYear: number,
  packageEditable: boolean,
  selectedPackages: IPackagingNeed[],
  receivingPlant: IReceivingPlant[],
  consequenses: IConsequense[],
  changeCaseId: (Id: string) => void,
  fetchCaseById: (Id: number) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editCase: (arg: { niiCase: any }) => Promise<number>,
  fetchConsequensesByCase: (Id: number) => void
];
export const useCases = (): Readonly<CasesOperators> => {
  const dispatch = useAppDispatch();
  const currentCase = useAppSelector(currentCaseSelector);
  const currentCaseId = useAppSelector(currentCaseIdSelector);
  const packages = useAppSelector(packagesSelector);
  const packageYear = useAppSelector(packageYearSelector);
  const packageEditable = useAppSelector(packageEditableSelector);
  const selectedPackages = useAppSelector(selectedPackagesSelector);
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
  return [
    isFetching,
    errorMessage,
    currentCase,
    currentCaseId,
    packages,
    packageYear,
    packageEditable,
    selectedPackages,
    receivingPlant,
    consequenses,
    changeCaseId,
    fetchCaseById,
    editCase,
    fetchConsequensesByCase,
  ];
};
