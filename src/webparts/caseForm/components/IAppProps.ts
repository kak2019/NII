import { IConsequense } from "../../../common/model/consequense";
import { INiiCaseItem } from "../../../common/model/niicase";
import { IPackaging } from "../../../common/model/packagingneed";
import { IReceivingPlant } from "../../../common/model/receivingplant";

export interface IAppProps {
  currentCase: INiiCaseItem;
  packages: IPackaging[];
  receivingPlant: IReceivingPlant[];
  consequenses: IConsequense[];
  packageYear: number;
  packageEditable: boolean;
  selectedPackages: IPackaging[];
}
