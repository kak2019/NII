import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { INiiCaseItem } from "../../model/niicase";
import { IConsequense } from "../../model/consequense";
import { IPackaging } from "../../model/packagingneed";

const fetchById = async (arg: { Id: number }): Promise<INiiCaseItem> => {
  const sp = spfi(getSP());
  try {
    const item = await sp.web.lists
      .getByTitle("Nii Cases")
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
                        <FieldRef Name="Title"/>
                        <FieldRef Name="CompanyName"/>
                        <FieldRef Name="ASNStreet"/>
                        <FieldRef Name="ASNPostCode"/>
                        <FieldRef Name="ASNCountryCode"/>
                        <FieldRef Name="BilltoNo"/>
                        <FieldRef Name="BillStreet"/>
                        <FieldRef Name="BillPostCode"/>
                        <FieldRef Name="BillCountryCode"/>
                        <FieldRef Name="ShipToNo"/>
                        <FieldRef Name="ShipStreet"/>
                        <FieldRef Name="ShipPostcode"/>
                        <FieldRef Name="ShipCountryCode"/>
                        <FieldRef Name="VatNo"/>
                        <FieldRef Name="PARMANo"/>
                        <FieldRef Name="GSDBID"/>
                        <FieldRef Name="ContractName"/>
                        <FieldRef Name="ContractEmail"/>
                        <FieldRef Name="ContractPhoneno"/>
                        <FieldRef Name="Constatus"/>
                        <FieldRef Name="ConPackagingAccno"/>
                        <FieldRef Name="ConCompanyName"/>
                        <FieldRef Name="ConCity"/>
                        <FieldRef Name="ConCountryCode"/>
                        <FieldRef Name="RequestDate"/>
                        <FieldRef Name="IssuCompName"/>
                        <FieldRef Name="IssuName"/>
                        <FieldRef Name="IssuPhoneNo"/>
                        <FieldRef Name="IssuEmail"/>
                        <FieldRef Name="Status"/>
                        <FieldRef Name="ASNPhone"/>
                        <FieldRef Name="BillPhone"/>
                        <FieldRef Name="ShipPhone"/>
                        <FieldRef Name="CaseID"/>
                      </ViewFields>
                      <RowLimit>1</RowLimit>
                    </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          let dateWebPart = "";
          if (response.Row[0].RequestDate.length > 0) {
            const dateSP = response.Row[0].RequestDate.split("/");
            const month = dateSP[0];
            dateSP[0] = dateSP[1];
            dateSP[1] = month;
            dateWebPart = dateSP.join("/");
          }
          return {
            ID: response.Row[0].ID,
            Created: response.Row[0].Created,
            Approval: response.Row[0].Approval,
            CaseID: response.Row[0].CaseID,
            PARMANo: response.Row[0].PARMANo,
            CompanyName: response.Row[0].CompanyName,
            Status: response.Row[0].Status,
            ASNStreet: response.Row[0].ASNStreet,
            ASNPostCode: response.Row[0].ASNPostCode,
            ASNCountryCode: response.Row[0].ASNCountryCode,
            ASNPhone: response.Row[0].ASNPhone,
            BilltoNo: response.Row[0].BilltoNo,
            BillStreet: response.Row[0].BillStreet,
            BillPostCode: response.Row[0].BillPostCode,
            BillCountryCode: response.Row[0].BillCountryCode,
            BillPhone: response.Row[0].BillPhone,
            ShipToNo: response.Row[0].ShipToNo,
            ShipStreet: response.Row[0].ShipStreet,
            ShipPostcode: response.Row[0].ShipPostcode,
            ShipCountryCode: response.Row[0].ShipCountryCode,
            ShipPhone: response.Row[0].ShipPhone,
            VatNo: response.Row[0].VatNo,
            GSDBID: response.Row[0].GSDBID,
            ContractName: response.Row[0].ContractName,
            ContractEmail: response.Row[0].ContractEmail,
            ContractPhoneno: response.Row[0].ContractPhoneno,
            Constatus: response.Row[0].Constatus,
            ConPackagingAccno: response.Row[0].ConPackagingAccno,
            ConCompanyName: response.Row[0].ConCompanyName,
            ConCity: response.Row[0].ConCity,
            ConCountryCode: response.Row[0].ConCountryCode,
            RequestDate: dateWebPart,
            IssuCompName: response.Row[0].IssuCompName,
            IssuName: response.Row[0].IssuName,
            IssuPhoneNo: response.Row[0].IssuPhoneNo,
            IssuEmail: response.Row[0].IssuEmail,
          } as INiiCaseItem;
        } else {
          return {} as INiiCaseItem;
        }
      });
    return item;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch Case by Id");
  }
};
const editCase = async (arg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  niiCase: any;
}): Promise<INiiCaseItem> => {
  const { niiCase } = arg;
  const sp = spfi(getSP());
  try {
    const list = sp.web.lists.getByTitle("Nii Cases");
    await list.items.getById(+niiCase.ID).update(niiCase);
    const result = await fetchById({ Id: +niiCase.ID });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when update Nii Case");
  }
};
const fetchConsequensesByCase = async (arg: {
  CaseId: number;
}): Promise<IConsequense[]> => {
  const sp = spfi(getSP());
  try {
    const result = await sp.web.lists
      .getByTitle("Consequenses List")
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
		                        <FieldRef Name="Packaging"/>
		                        <FieldRef Name="PackagingName"/>
		                        <FieldRef Name="Demand"/>
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
                Packaging: item.Packaging,
                PackagingName: item.PackagingName,
                Demand: item.Demand,
              } as IConsequense)
          );
        } else {
          return [] as IConsequense[];
        }
      });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch Consequenses by Case");
  }
};
const fetchPackagingNeedsByCase = async (arg: {
  CaseId: number;
}): Promise<IPackaging[]> => {
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
const editPackagingNeed = async (arg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Packaging: any;
}): Promise<IPackaging> => {
  const { Packaging } = arg;
  const sp = spfi(getSP());
  try {
    const list = sp.web.lists.getByTitle("Packaging List");
    await list.items.getById(+Packaging.ID).update(Packaging);
    const result = await fetchById({ Id: +Packaging.ID });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when update Packging Need");
  }
};
const removePackagingNeedsById = async (arg: {
  Id: number;
}): Promise<IPackaging> => {
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

//Thunk function
export const fetchByIdAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchById`,
  fetchById
);
export const editCaseAction = createAsyncThunk(
  `${FeatureKey.CASES}/editCase`,
  editCase
);
export const fetchConsequensesByCaseAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchConsequensesByCase`,
  fetchConsequensesByCase
);
export const fetchPackagingNeedsByCaseAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchPackagingNeedsByCase`,
  fetchPackagingNeedsByCase
);
export const editPackagingNeedAction = createAsyncThunk(
  `${FeatureKey.CASES}/editPackagingNeed`,
  editPackagingNeed
);
export const removePackagingNeedsByIdAction = createAsyncThunk(
  `${FeatureKey.CASES}/removePackagingNeedsById`,
  removePackagingNeedsById
);
