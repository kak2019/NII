import { IConsequense } from "../../../common/model/consequense";
import { INiiCaseItem } from "../../../common/model/niicase";
import { IPackagingNeed } from "../../../common/model/packagingneed";
import { IReceiverPlant } from "../../../common/model/receiverplant";

export interface IAppProps {
  currentCase: INiiCaseItem;
  packages: IPackagingNeed[];
  packageYear: number;
  packageEditable: boolean;
  selectedPackages: IPackagingNeed[];
  receivingPlant: IReceiverPlant[];
  consequenses: IConsequense[];
}
