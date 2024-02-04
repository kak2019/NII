import { spfi } from "@pnp/sp";
import { getSP } from "../../pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/content-types";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeatureKey } from "../../featureKey";
import { INiiCaseItem } from "../../model/niicase";
import { IConsequense } from "../../model/consequense";
import { IPackaging } from "../../model/packagingneed";
import { IReceivingPlant } from "../../model/receivingplant";
import { IPackagingData } from "../../model/packagingdata";
import { CASECONST } from "./casesSlice";
import { IFileInfo } from "@pnp/sp/files";
import { RcFile } from "antd/lib/upload";

const fetchById = async (arg: { Id: number }): Promise<INiiCaseItem> => {
  const sp = spfi(getSP());
  try {
    const item = await sp.web.lists
      .getByTitle(CASECONST.CASE_LIST)
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
                        <FieldRef Name="Created"/>
                        <FieldRef Name="Author"/>
                      </ViewFields>
                      <RowLimit>1</RowLimit>
                    </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          let dateWebPart = "";
          if (response.Row[0].RequestDate.length > 0) {
            const dateSP = response.Row[0].RequestDate.split("/");
            let month = dateSP[0];
            let day = dateSP[1];
            if (month.length === 1) {
              month = `0${month}`;
            }
            if (day.length === 1) {
              day = `0${day}`;
            }
            dateSP[0] = day;
            dateSP[1] = month;
            dateWebPart = dateSP.join("-");
          }
          let dateCreated = "";
          if (response.Row[0].Created.length > 0) {
            const dateSPCreated = response.Row[0].Created.split("/");
            let monthCreated = dateSPCreated[0];
            let dayCreated = dateSPCreated[1];
            if (monthCreated.length === 1) {
              monthCreated = `0${monthCreated}`;
            }
            if (dayCreated.length === 1) {
              dayCreated = `0${dayCreated}`;
            }
            dateSPCreated[0] = dayCreated;
            dateSPCreated[1] = monthCreated;
            dateCreated = dateSPCreated.join("-").split(/(\s+)/)[0];
          }
          let approval: number = null;
          switch (response.Row[0].Status) {
            case "Case Approved": {
              approval = 1;
              break;
            }
            case "Case Rejected": {
              approval = 0;
              break;
            }
          }
          return {
            ID: response.Row[0].ID,
            Created: dateCreated,
            Author: response.Row[0].Author[0].title,
            Approval: approval,
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
          return Promise.reject(new Error("Case not found"));
        }
      });
    return item;
  } catch (err) {
    console.log(err);
    return Promise.reject(err.message);
  }
};
const editCase = async (arg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  niiCase: any;
}): Promise<INiiCaseItem> => {
  const { niiCase } = arg;
  const sp = spfi(getSP());
  try {
    const list = sp.web.lists.getByTitle(CASECONST.CASE_LIST);
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
      .getByTitle(CASECONST.CONSEQUENSES_LIST)
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
      .getByTitle(CASECONST.PACKAGING_LIST)
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
const editPackagingNeed = async (arg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Packaging: any;
}): Promise<IPackaging> => {
  const { Packaging } = arg;
  const PackagingEdit = {
    ID: Packaging.ID,
    MasterID: Packaging.MasterID,
    CaseID: Packaging.CaseID,
    Year: Packaging.Year,
    Packaging: Packaging.Packaging,
    PackagingName: Packaging.PackagingName,
    WeeklyDemand: Packaging.WeeklyDemand.toString(),
    YearlyDemand: Packaging.YearlyDemand.toString(),
    SupplierNo: Packaging.SupplierNo,
    SupplierName: Packaging.SupplierName,
  };
  const sp = spfi(getSP());
  try {
    await sp.web.lists
      .getByTitle(CASECONST.PACKAGING_LIST)
      .items.getById(+Packaging.ID)
      .update(PackagingEdit);
    const result = await fetchById({ Id: +Packaging.ID });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when update Packging Need");
  }
};
const addPackagingNeed = async (arg: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Packaging: any;
}): Promise<IPackaging> => {
  const { Packaging } = arg;
  const sp = spfi(getSP());
  const PackagingAdd = {
    MasterID: Packaging.MasterID,
    CaseID: Packaging.CaseID,
    Year: Packaging.Year,
    Packaging: Packaging.Packaging,
    PackagingName: Packaging.PackagingName,
    WeeklyDemand: Packaging.WeeklyDemand.toString(),
    YearlyDemand: Packaging.YearlyDemand.toString(),
    SupplierNo: Packaging.SupplierNo,
    SupplierName: Packaging.SupplierName,
  };
  try {
    await sp.web.lists
      .getByTitle(CASECONST.PACKAGING_LIST)
      .items.add(PackagingAdd);
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when add Packging Need");
  }
};
const removePackagingNeedsById = async (arg: {
  Id: number;
}): Promise<IPackaging> => {
  const sp = spfi(getSP());
  try {
    await sp.web.lists
      .getByTitle(CASECONST.PACKAGING_LIST)
      .items.getById(arg.Id)
      .delete();
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when removing Packagings");
  }
};
const fetchReceivingPlantByCase = async (arg: {
  CaseId: number;
}): Promise<IReceivingPlant[]> => {
  const sp = spfi(getSP());
  try {
    const result = await sp.web.lists
      .getByTitle(CASECONST.RECEIVING_LIST)
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
		                        <FieldRef Name="PackagingAccountNo"/>
		                        <FieldRef Name="CompanyName"/>
		                        <FieldRef Name="City"/>
                            <FieldRef Name="CountryCode"/>
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
                PackagingAccountNo: item.PackagingAccountNo,
                CompanyName: item.CompanyName,
                City: item.City,
                CountryCode: item.CountryCode,
              } as IReceivingPlant)
          );
        } else {
          return [] as IReceivingPlant[];
        }
      });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch Consequenses by Case");
  }
};
const fetchPackagingData = async (): Promise<IPackagingData[]> => {
  const sp = spfi(getSP());
  try {
    const result = await sp.web.lists
      .getByTitle(CASECONST.PACKAGING_DATA_LIST)
      .renderListDataAsStream({
        ViewXml: `<View>
	                        <ViewFields>
		                        <FieldRef Name="ItemNumber"/>
		                        <FieldRef Name="Description"/>
	                        </ViewFields>
	                        <RowLimit>5000</RowLimit>
                        </View>`,
      })
      .then((response) => {
        if (response.Row.length > 0) {
          return response.Row.map(
            (item) =>
              ({
                ItemNumber: item.ItemNumber,
                Description: item.Description,
              } as IPackagingData)
          );
        } else {
          return [] as IPackagingData[];
        }
      });
    return result;
  } catch (err) {
    console.log(err);
    return Promise.reject("Error when fetch Packaging Data");
  }
};
const fetchContractFileById = async (arg: {
  Id: number;
}): Promise<IFileInfo[]> => {
  const sp = spfi(getSP());
  try {
    const contractFileId = await sp.web.lists
      .getByTitle(CASECONST.LIBRARY_NAME)
      .contentTypes()
      .then((result) => {
        return result.filter((i) => i.Name === CASECONST.CONTRACT_TYPE)[0].Id
          .StringValue;
      });
    const contractFiles = await sp.web
      .getFolderByServerRelativePath(`${CASECONST.LIBRARY_NAME}/${arg.Id}`)
      .files.expand("ListItemAllFields")()
      .then((files) => {
        return files.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (file: any) => file.ListItemAllFields.ContentTypeId === contractFileId
        );
      });
    return contractFiles;
  } catch (err) {
    console.log(err);
    return [] as IFileInfo[];
  }
};
const fetchOriginalFileById = async (arg: {
  Id: number;
}): Promise<IFileInfo[]> => {
  const sp = spfi(getSP());
  try {
    const contractFileId = await sp.web.lists
      .getByTitle(CASECONST.LIBRARY_NAME)
      .contentTypes()
      .then((result) => {
        return result.filter((i) => i.Name === CASECONST.UPLOAD_FILE)[0].Id
          .StringValue;
      });
    const contractFiles = await sp.web
      .getFolderByServerRelativePath(`${CASECONST.LIBRARY_NAME}/${arg.Id}`)
      .files.expand("ListItemAllFields")()
      .then((files) => {
        console.log(files);
        return files.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (file: any) => file.ListItemAllFields.ContentTypeId === contractFileId
        );
      });
    return contractFiles;
  } catch (err) {
    console.log(err);
    return [] as IFileInfo[];
  }
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const uploadFile = async (arg: {
  newFile: RcFile[];
  replace: boolean;
  oldFileUrl: string;
  caseId: string;
}): Promise<void> => {
  const sp = spfi(getSP());
  const reader = new FileReader();
  arg.newFile.forEach((file) => {
    reader.onloadend = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      await sp.web
        .getFolderByServerRelativePath(
          `${CASECONST.LIBRARY_NAME}/${arg.caseId}`
        )
        .files.addUsingPath(file.name, arrayBuffer)
        .then(async (addResult) => {
          await sp.web.lists
            .getByTitle(CASECONST.LIBRARY_NAME)
            .contentTypes()
            .then(async (contentTypes) => {
              const contentTypeContract = contentTypes.filter(
                (ct) => ct.Name === CASECONST.CONTRACT_TYPE
              )[0];
              await addResult.file.getItem().then(async (item) => {
                await item.update({
                  ContentTypeId: contentTypeContract.Id.StringValue,
                });
              });
            });
        });
    };
    reader.readAsArrayBuffer(file);
  });
  if (arg.replace) {
    await sp.web
      .getFileByServerRelativePath(arg.oldFileUrl)
      .delete()
      .then((_) => {
        console.log("File deleted successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return;
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
export const addPackagingNeedAction = createAsyncThunk(
  `${FeatureKey.CASES}/addPackagingNeed`,
  addPackagingNeed
);
export const removePackagingNeedsByIdAction = createAsyncThunk(
  `${FeatureKey.CASES}/removePackagingNeedsById`,
  removePackagingNeedsById
);
export const fetchReceivingPlantByCaseAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchReceivingPlantByCase`,
  fetchReceivingPlantByCase
);
export const fetchPackagingDataAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchPackagingData`,
  fetchPackagingData
);
export const fetchContractFileByIdAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchContractFileById`,
  fetchContractFileById
);
export const fetchOriginalFileByIdAction = createAsyncThunk(
  `${FeatureKey.CASES}/fetchOriginalFileById`,
  fetchOriginalFileById
);
export const uploadFileAction = createAsyncThunk(
  `${FeatureKey.CASES}/uploadFile`,
  uploadFile
);
