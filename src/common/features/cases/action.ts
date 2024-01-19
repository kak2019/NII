import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { INiiCaseItem } from "../../model/niicase";

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
                        <FieldRef Name="Case ID"/>
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
    console.log(item);
    return item;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch request by Id");
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
//Thunk function
export const fetchByIdAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchById`,
  fetchById
);

export const editCaseAction = createAsyncThunk(
  `${FeatureKey.CASES}/editCase`,
  editCase
);
