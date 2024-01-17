export interface IPackagingNeed {
  key: React.Key;
  packaging?: string;
  packagingName?: string;
  qtyWeekly?: number;
  qtyYearly?: number;
}

export interface IPackagingList {
  MasterID?: string;
  CaseID?: string;
  Year?: string;
  Packaging?: string;
  PackagingName?: string;
  WeeklyDemand?: number;
  YearlyDemand?: number;
  SupplierNo?: string;
  SupplierName?: string;
}
