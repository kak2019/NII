import { INiiCaseItem } from "../../../common/model/niicase";
import { IPackagingNeed } from "../../../common/model/packagingneed";

export interface IAppProps {
  currentCase: INiiCaseItem;
  packages: IPackagingNeed[];
  packageYear: number;
  packageEditable: boolean;
  selectedPackages: IPackagingNeed[];
}
