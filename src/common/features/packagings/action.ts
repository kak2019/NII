import { spfi } from "@pnp/sp";
import { IPackaging } from "../../model/packagingneed";
import { getSP } from "../../pnpjsConfig";
import { PACKAGINGCONST } from "./packagingSlice";
import { FeatureKey } from "../../featureKey";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchPackagingNeeds = async (): Promise<IPackaging[]> => {
  const sp = spfi(getSP());
  try {
    const result = await sp.web.lists
      .getByTitle(PACKAGINGCONST.PACKAGING_LIST)
      .renderListDataAsStream({
        ViewXml: `<View>
	                        <ViewFields>
		                        <FieldRef Name="ID"/>
		                        <FieldRef Name="CaseID"/>
		                        <FieldRef Name="Packaging"/>
                            <FieldRef Name="PackagingName"/>
                            <FieldRef Name="SupplierNo"/>
                            <FieldRef Name="SupplierName"/>
                            <FieldRef Name="Year"/>
                            <FieldRef Name="WeeklyDemand"/>
                            <FieldRef Name="YearlyDemand"/>
                            <FieldRef Name="MasterID"/>
	                        </ViewFields>
	                        <RowLimit>5000</RowLimit>
                        </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          return response.Row.map(
            (item) =>
              ({
                key: item.ID,
                ID: item.ID,
                CaseID: item.CaseID,
                Packaging: item.Packaging,
                PackagingName: item.PackagingName,
                WeeklyDemand: item.WeeklyDemand,
                YearlyDemand: item.YearlyDemand,
                SupplierNo: item.SupplierNo,
                SupplierName: item.SupplierName,
                MasterID: item.MasterID,
                Year: item.Year,
              } as IPackaging)
          );
        } else {
          return [] as IPackaging[];
        }
      });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch Packagings by Case");
  }
};

export const fetchPackagingNeedsAction = createAsyncThunk(
  `${FeatureKey.PACKAGINGS}/fetchPackagingNeeds`,
  fetchPackagingNeeds
);
