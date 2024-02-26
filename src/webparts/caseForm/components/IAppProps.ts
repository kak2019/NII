import { IConsequense } from "../../../common/model/consequense";
import { INiiCaseItem } from "../../../common/model/niicase";
import { IPackaging } from "../../../common/model/packagingneed";
import { IReceivingPlant } from "../../../common/model/receivingplant";

export interface IAppProps {
  currentCase: INiiCaseItem;
  packagingNeeds: IPackaging[];
  receivingPlant: IReceivingPlant[];
  consequenses: IConsequense[];
  packageYear: number;
  packageEditable: boolean;
  selectedPackages: IPackaging[];
  removePackagingIds: number[];
  isEditableCommon: boolean;
  isStatusEditable: boolean;
  isContractEditable: boolean;
  isApprovalAllow: boolean;
  isPackagingNeedsEditable: boolean;
  isSaveDisable: boolean;
  userRoles: string[];
}
