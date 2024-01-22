import { spfi } from "@pnp/sp";
import { IPackaging } from "../../model/packagingneed";
import { getSP } from "../../pnpjsConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";

const fetchByCase = async (arg: { CaseId: number }): Promise<IPackaging[]> => {
  const sp = spfi(getSP());
  try {
    const result = await sp.web.lists
      .getByTitle("Packaging List")
      .renderListDataAsStream({
        ViewXml: `<View>
	                        <Query>
		                        <Where>
			                        <Eq>
				                        <FieldRef Name="MasterID"/>
				                        <Value Type="Text">${arg.CaseId}</Value>
			                        </Eq>
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
          console.log(response);
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

const fetchById = async (arg: { Id: number }): Promise<IPackaging> => {
  const sp = spfi(getSP());
  try {
    const item = await sp.web.lists
      .getByTitle("Packaging List")
      .renderListDataAsStream({
        ViewXml: `<View>
                      <Query>
                        <Where>
                          <Eq>
                            <FieldRef Name="ID"/>
                            <Value Type="Text">${arg.Id}</Value>
                          </Eq>
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
                      <RowLimit>1</RowLimit>
                    </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          return {
            key: response.Row[0].ID,
            ID: response.Row[0].ID,
            CaseID: response.Row[0].CaseID,
            Packaging: response.Row[0].Packaging,
            PackagingName: response.Row[0].PackagingName,
            WeeklyDemand: response.Row[0].WeeklyDemand,
            YearlyDemand: response.Row[0].YearlyDemand,
            SupplierNo: response.Row[0].SupplierNo,
            SupplierName: response.Row[0].SupplierName,
            MasterID: response.Row[0].MasterID,
          } as IPackaging;
        } else {
          return {} as IPackaging;
        }
      });
    return item;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch Packaging by Id");
  }
};

const removeById = async (arg: { Id: number }): Promise<IPackaging> => {
  const sp = spfi(getSP());
  try {
    await sp.web.lists
      .getByTitle("Packaging List")
      .items.getById(arg.Id)
      .delete();
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when removing Packagings");
  }
};

const editPackaging = async (arg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Packaging: any;
}): Promise<IPackaging> => {
  const { Packaging } = arg;
  const sp = spfi(getSP());
  try {
    const list = sp.web.lists.getByTitle("Nii Cases");
    await list.items.getById(+Packaging.ID).update(Packaging);
    const result = await fetchById({ Id: +Packaging.ID });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when update Nii Case");
  }
};
export const fetchPackagingsByCaseAction = createAsyncThunk(
  `${FeatureKey.PACKAGINGS}/fetchPackagingsByCase`,
  fetchByCase
);

export const editPackagingAction = createAsyncThunk(
  `${FeatureKey.PACKAGINGS}/editPackaging`,
  editPackaging
);

export const removePackagingByIdAction = createAsyncThunk(
  `${FeatureKey.PACKAGINGS}/removePackagingById`,
  removeById
);
