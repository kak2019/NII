import { spfi } from "@pnp/sp";
import { IPackaging } from "../../model/packagingneed";
import { getSP } from "../../pnpjsConfig";
import { PACKAGINGCONST } from "./packagingSlice";
import { FeatureKey } from "../../featureKey";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchAllPackagingNeeds = async (): Promise<IPackaging[]> => {
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
	                        <RowLimit>500000</RowLimit>
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
    return Promise.reject("Error when fetch Packagings");
  }
};
const fetchSupplierNameByParma = async (arg: {
  ParmaNum: string;
}): Promise<string> => {
  const sp = spfi(getSP());
  try {
    const result = await sp.web.lists
      .getByTitle(PACKAGINGCONST.PACKAGING_LIST)
      .renderListDataAsStream({
        ViewXml: `<View>
	                        <Query>
		                        <Where>
			                        <Eq>
				                        <FieldRef Name="SupplierNo"/>
				                        <Value Type="Text">${arg.ParmaNum}</Value>
			                        </Eq>
		                        </Where>
	                        </Query>
	                        <ViewFields>
                            <FieldRef Name="SupplierNo"/>
                            <FieldRef Name="SupplierName"/>
	                        </ViewFields>
	                        <RowLimit>5</RowLimit>
                        </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          return response.Row[0].SupplierName;
        } else {
          return "";
        }
      });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch Supplier Name");
  }
};
const fetchPackagingNeeds = async (arg: {
  ParmaNum: string;
  Year: string;
  CaseID: string;
}): Promise<IPackaging[]> => {
  const sp = spfi(getSP());
  const conditions = [];
  if (arg.ParmaNum) {
    conditions.push(`<Contains>
                        <FieldRef Name="SupplierNo"/>
                        <Value Type="Text">${arg.ParmaNum}</Value>
                      </Contains>`);
  }
  if (arg.Year) {
    conditions.push(`<Contains>
                        <FieldRef Name="Year"/>
                        <Value Type="Text">${arg.Year}</Value>
                      </Contains>`);
  }
  if (arg.CaseID) {
    conditions.push(`<Contains>
                        <FieldRef Name="CaseID"/>
                        <Value Type="Text">${arg.CaseID}</Value>
                      </Contains>`);
  }
  const whereClause = conditions.reduce((prevCondition, currentCondition) => {
    if (prevCondition === "") {
      return currentCondition;
    } else {
      return `<And>${prevCondition}${currentCondition}</And>`;
    }
  }, "");
  try {
    const result = await sp.web.lists
      .getByTitle(PACKAGINGCONST.PACKAGING_LIST)
      .renderListDataAsStream({
        ViewXml: `<View>
	                        <Query>
		                        <Where>
                              ${whereClause}
                            </Where>
	                        </Query>
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
    return Promise.reject("Error when fetch Packagings");
  }
};

export const fetchAllPackagingNeedsAction = createAsyncThunk(
  `${FeatureKey.PACKAGINGS}/fetchAllPackagingNeeds`,
  fetchAllPackagingNeeds
);
export const fetchSupplierNameByParmaAction = createAsyncThunk(
  `${FeatureKey.PACKAGINGS}/fetchSupplierNameByParma`,
  fetchSupplierNameByParma
);
export const fetchPackagingNeedsAction = createAsyncThunk(
  `${FeatureKey.PACKAGINGS}/fetchPackagingNeeds`,
  fetchPackagingNeeds
);
