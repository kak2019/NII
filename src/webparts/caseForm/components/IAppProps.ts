import { IConsequense } from "../../../common/model/consequense";
import { INiiCaseItem } from "../../../common/model/niicase";
import { IPackagingNeed } from "../../../common/model/packagingneed";
import { IReceivingPlant } from "../../../common/model/receivingplant";

export interface IAppProps {
  currentCase: INiiCaseItem;
  packages: IPackagingNeed[];
  packageYear: number;
  packageEditable: boolean;
  selectedPackages: IPackagingNeed[];
  receivingPlant: IReceivingPlant[];
  consequenses: IConsequense[];
}
