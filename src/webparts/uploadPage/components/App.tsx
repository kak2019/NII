/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import * as React from "react";
import { memo, useContext } from "react";
//import { read, utils, SSF }  as XLSX from 'xlsx';
import * as XLSX from 'xlsx';
import { useState } from "react";
import { Button } from "antd";
import { addRequest } from "./utils/request";
import 'antd/dist/antd.css';
import { Stack } from '@fluentui/react/lib/Stack';
// import { Label } from '@fluentui/react/lib/Label';
import { Icon } from "office-ui-fabric-react";
// import { Icon as IconBase } from '@fluentui/react/lib/Icon';
import { Upload, Modal } from 'antd';
// import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { useEffect } from "react";
import { mytoken } from "../UploadPageWebPart";
import * as moment from "moment";
import { spfi } from "@pnp/sp";
import { getSP } from "../../../common/pnpjsConfig";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import styles from './UploadPage.module.scss'
import FileSvg from '../assets/file'
import Del from '../assets/delete'
import Error from '../assets/error'
import AppContext from "../../../common/AppContext";
import  Viewhistory from '../assets/submit';
// import * as moment from "moment";
// import helpers from "../../../config/Helpers";
// 定义 Excel 文件中数据的类型
// interface IexcelData {
//     PARMANo: string;
//     CompanyName: string;
//     ASNStreet: string;
//     ASNPostCode: string;
//     ASNCountryCode: string;
//     ASNPhone: string
// }



interface Address {
    addressType: string;
    addressLine: string;
    inCareOf: string;
    street: string;
    houseNr: string;
    poBox: string;
    city: string;
    postalCode: string;
    district: string;
    poBoxCity: string;
    poBoxPostalCode: string;
    countryCode: string;
    countryName: string;
    regionCode: string;
    regionName: string;
    phoneNumber: string;
    faxNumber: string;
    email: string;
}
interface InternationalVersion {
    address: Address[];
}
interface JsonData {
    id: string;
    parentParmaId: string;
    parmaID: string;
    status: string;
    creationDate: string;
    updatedDate: string;
    communicationLanguage: string;
    internationalVersion: InternationalVersion;
    // ... 其他属性
}
function extractAddresses(jsonObject: JsonData): Address[] {
    // 提取地址信息
    const addresses = jsonObject.internationalVersion.address;
    return addresses;
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getArrayKey = (arr: Array<{ [key in string]: any }>, key: string) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]['UD-KMP'] === key) {
            return arr[i]
        }
    }
}


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getSubTableData = (arr: Array<{ [key in string]: any }>) => {
    let i = 30
    const res = []
    while (arr[i]['UD-KMP'] !== "CONSEQUENSES FOR OTHER SUPPLIERS?:") {
        // res.push(arr[i])
        res.push({ "Packaging account no": arr[i]['UD-KMP'], "company name": arr[i]?.__EMPTY, "City": arr[i]?.__EMPTY_1, 'Country Code': arr[i]?.__EMPTY_2 ? String(arr[i]?.__EMPTY_2) : "" })
        i++
    }
    return res
}

// 获取61-72
const getPackageData = (arr: Array<{ [key in string]: any }>) => {
    // @ts-ignore 
    const start = arr.findIndex(val => val.__rowNum__ === 59)
    // @ts-ignore eslint-disable-next-line
    const end = arr.findIndex(val => val.__rowNum__ === 72)

    return arr.slice(start + 1, end).map(val => {
        return { "Packaging": val['__EMPTY_1'], "Packaging Name": val.__EMPTY_2, "Yearly need": val.__EMPTY_3 }
    })
}

function sanitize(input: string) {
    // based on https://support.microsoft.com/en-us/help/905231/information-about-the-characters-that-you-cannot-use-in-site-names--fo
    // replace invalid characters
    let sanitizedInput = input.replace(/['~"#%&*:<>?/{|}]/g, "_");
    // replace consecutive periods
    sanitizedInput = sanitizedInput.replace(/\.+/g, ".");
    // replace leading period
    sanitizedInput = sanitizedInput.replace(/^\./, "");
    // replace leading underscore
    sanitizedInput = sanitizedInput.replace(/^_/, "");
    return sanitizedInput;
}

// 获取79-101
const getData2 = (arr: Array<{ [key in string]: any }>) => {
    // @ts-ignore 
    const start = arr.findIndex(val => val.__rowNum__ === 79)
    // @ts-ignore eslint-disable-next-line
    const end = arr.findIndex(val => val.__rowNum__ === 101)

    const table1 = arr.slice(start + 1, end).map(val => {
        return {
            "Packaging": val['UD-KMP'],
            "weekly need": val.__EMPTY,
            "Packaging Name": val['__EMPTY_4'],
            "Yearly need": val['Mandatory field'],
        }
    }).filter(val => val.Packaging !== 0 && val.Packaging !== undefined && val.Packaging !== '' )

    // const table2 = arr.slice(start + 1, end).map(val => {
    //     return { 
    //         "Packaging": val['__EMPTY_3'],
    //         "Packaging Name": val['__EMPTY_4'],
    //         "Yearly need":val['__EMPTY_5'],
    //     }
    // })
    // return [table1, table2]
    return table1

}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type


export default memo(function App() {
    const sp = spfi(getSP());
    const [items, setItems] = useState([]);
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [parmainfo, setParmainfo] = useState<JsonData>();
    const [address, setAddress] = useState([]);
    const [showBtn, setShowBtn] = useState(false)
    const [uploadFile, setFile] = useState<any>()
    const [isShowModal, setIsShowModal] = useState(false)
    // const [apiResponse, setApiResponse] = useState<any>(null);
    const [submiting, setSubmiting] = React.useState<boolean>(false)
    const [spParmaList, setspParmaList] = React.useState([])
    const [fileWarning, setfileWarning] = React.useState("")
    const [buttonvisible, setbuttonVisible] = React.useState<boolean>(true)
    const ctx = useContext(AppContext);
    const webURL = ctx.context?._pageContext?._web?.absoluteUrl;
    const validate = (json: any) => {
        if (!json['Supplier parma code']) return 'Please input valid Parma and Company Name';
        if (!json['Company name']) return 'Please input valid Parma and Company Name';
        //The Parma(33345) is existed with Case ID: 23001. Do you want to create a new case for 33345?
        //if ((spParmaList['PARMANO'].indexOf(json['Supplier parma code'] + "") > -1)) setfileWarning("The Parma(" + json['Supplier parma code'] + ") is existed with Case ID: 23001. create a new case for 33345?")
        // if(!json['Supplier']) return '请输入Supplier'
        console.log(spParmaList.indexOf(json['Supplier parma code']))

        spParmaList.forEach(item=>{
            if(item['PARMANo']+"" ===json['Supplier parma code']+""){
                setfileWarning("The Parma(" + json['Supplier parma code'] + ") is existed with Case ID:" + item['CaseID'] + ". create a new case for "+ json['Supplier parma code']+"?")
                console.log("item['PARMANo']",item['PARMANo'])
                console.log("item['PARMANo']",item['CaseID'])
            }
        
        
        })
        console.log("filewarning",fileWarning)
    }
    interface CaseItem {
        PARMANo: string;
        CaseID: string;
    }
    useEffect(() => {

        const itemoption = sp.web.lists.getByTitle("Nii Cases").renderListDataAsStream({
            ViewXml: `<View>
                          <ViewFields>
                            <FieldRef Name="CaseID"/>
                            <FieldRef Name="PARMANo"/>
                            <FieldRef Name="IssuName"/>
                            <FieldRef Name="GSDBID"/>
                            <FieldRef Name="RequestDate"/>
                            <FieldRef Name="Status"/>
                            <FieldRef Name="Created"/>
                            <FieldRef Name="ASNCountryCode"/>
                          </ViewFields>
                       
                        </View>`,
            // <RowLimit>400</RowLimit>
        }).then((response) => {
            console.log("res", response.Row)
            if (response.Row.length > 0) {
                //const parmaNoList = response.Row.map((item: { PARMANo: string; }) => item.PARMANo).filter(parmaNo => parmaNo !== undefined && parmaNo !== "undefined");
                const parmaNoList = response.Row.filter(item => item.PARMANo && item.CaseID).map(item => ({
                    PARMANo: item.PARMANo,
                    CaseID: item.CaseID
                }));
                const uniqueByPARMANo: { [key: string]: CaseItem } = {};
                parmaNoList.forEach(item => {
                    const parmaNo = item.PARMANo;
                    if (!uniqueByPARMANo[parmaNo]&& (parmaNo !=='undefined')) {
                        uniqueByPARMANo[parmaNo] = item;
                    }
                });
                //@ts-ignore
              const  uniparmaNoList =  Object.values(uniqueByPARMANo);
                //@ts-ignore
                //const uniqueParmaNoList = Array.from(new Set(parmaNoList));
                setspParmaList(uniparmaNoList)
                console.log("uni", uniparmaNoList);
            }
        }

        );
    }, [])



    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleFileUpload = (info: any) => {
        if (info.file) {
            const file = info.file
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const binaryStr = e.target?.result;
                if (typeof binaryStr === 'string') {
                    const workbook = XLSX.read(binaryStr, { type: 'binary' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    setItems(jsonData);
                    console.log("Json", jsonData)

                    const json = {
                        //'Supplier parma code': getArrayKey(jsonData, 'Supplier parma code :')?.__EMPTY_1
                        //@ts-ignore
                        'Supplier parma code': jsonData[jsonData.findIndex(val => val.__rowNum__ === 6)]?.__EMPTY_1,
                        //@ts-ignore
                        'Company name': jsonData[jsonData.findIndex(val => val.__rowNum__ === 7)]?.__EMPTY_1,
                    }

                    setData(json);
                    const validateError = validate(json)
                    setError(validateError);
                    if (validateError) {
                        setFile(null)
                    } else {
                        setFile(file)
                        setShowBtn(true)
                    }
                    console.log("error", error, validate(json));
                    console.log("json['Supplier parma code']", json['Supplier parma code'])

                    // if (json['Supplier parma code']) {
                    //     // const url = 'https://app-shared-svc-ud-parma-dev.azurewebsites.net/api/getparma/'+ json['Supplier parma code']
                    //     // helpers.getResponseFromAzureFunction(url, this.props.aadClient).then(data => {
                    //     //     console.log(data)
                    //     // }).catch(err => {
                    //     //     console.log(err)
                    //     // })
                    //     fetch('https://app-shared-svc-ud-parma-dev.azurewebsites.net/api/GetParma/' + json['Supplier parma code'], {
                    //         method: 'get',
                    //         headers: {
                    //             'Content-Type': 'application/json',
                    //             'Authorization': 'Bearer ' + mytoken
                    //         }
                    //     }).then(res => res.json()).then(res => {
                    //         console.log(res);
                    //         setParmainfo(res);
                    //         setShowBtn(true)
                    //     }).catch(error => {
                    //         console.log(error)
                    //     })
                    // } else {
                    //     setShowBtn(true)
                    // }

                    console.log("61-66", getPackageData(jsonData))
                    console.log("77-86两张表", getData2(jsonData))
                }
            };
            reader.readAsBinaryString(file);
        }
    };
    useEffect(() => {

        if (items.length > 0 && parmainfo && Object.keys(parmainfo).length > 0) {

            // 获取子表数据项
            console.log(getSubTableData(items))
            // 获取普通数据项
            console.log("Vatno", getArrayKey(items, 'First and Last Name:'))
            // 获取Parma 信息
            const addresses = extractAddresses(parmainfo);
            console.log('address', addresses);
            setAddress(addresses);
            // console.log("parma",parmainfo['internationalVersion'])
            // 子表后面的数据
            let index = 0
            for (let i = 0; i < items.length; i++) {
                if (items[i]['UD-KMP'] === 'CONSEQUENSES FOR OTHER SUPPLIERS?:') {
                    index = i
                    break
                }
            }
            // 获取不固定子表后面的数据
            const secItems = items.slice(index);
            console.log(secItems)
            console.log('Packaging account no', secItems[3].__EMPTY_1);
            //@ts-ignore
            console.log("新写法", items[items.findIndex(val => val.__rowNum__ === 55)])
        }
    }, [parmainfo, address])

    const submitFunction = async (): Promise<void> => {
        if (submiting) return
        setSubmiting(true)
        let index = 0
        for (let i = 0; i < items.length; i++) {
            if (items[i]['UD-KMP'] === 'CONSEQUENSES FOR OTHER SUPPLIERS?:') {
                index = i
                break
            }
        }
        // 获取不固定子表后面的数据
        const secItems = items.slice(index);
        console.log(secItems)
        console.log('Packaging account no', secItems[3].__EMPTY_1)
        const request = {
            PARMANo: items[3]?.__EMPTY_1&&String(items[3]?.__EMPTY_1),
            CompanyName: items[4]?.__EMPTY_1,
            //@ts-ignore
            ASNStreet: items[items.findIndex(val => val.__rowNum__ === 10)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 10)]?.__EMPTY_1),//address[0]?.street,      //String(items[6]?.__EMPTY_2),
            //@ts-ignore
            ASNPostCode: items[items.findIndex(val => val.__rowNum__ === 11)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 11)]?.__EMPTY_1),//String(address[0]?.postalCode),//String(items[7]?.__EMPTY_2),
            //@ts-ignore
            ASNCountryCode: items[items.findIndex(val => val.__rowNum__ === 12)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 12)]?.__EMPTY_1),// String(address[0]?.countryCode),//String(items[8]?.__EMPTY_2),
            //@ts-ignore
            ASNPhone: items[items.findIndex(val => val.__rowNum__ === 13)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 13)]?.__EMPTY_1),// String(address[0]?.phoneNumber),//String(items[9]?.__EMPTY_2),
            //Title:"111"
            //@ts-ignore
            BilltoNo: items[items.findIndex(val => val.__rowNum__ === 16)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 16)]?.__EMPTY_1),
            //@ts-ignore
            BillStreet: items[items.findIndex(val => val.__rowNum__ === 17)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 17)]?.__EMPTY_1),//address[1]?.street,//String(items[12]?.__EMPTY_2),
            //@ts-ignore
            BillPostCode: items[items.findIndex(val => val.__rowNum__ === 18)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 18)]?.__EMPTY_1),//String(address[1]?.postalCode),//String(items[13]?.__EMPTY_2),
            //@ts-ignore
            BillCountryCode: items[items.findIndex(val => val.__rowNum__ === 19)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 19)]?.__EMPTY_1),//String(address[1]?.countryCode),//String(items[14]?.__EMPTY_2),
            //@ts-ignore
            BillPhone: items[items.findIndex(val => val.__rowNum__ === 20)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 20)]?.__EMPTY_1),// String(address[0]?.phoneNumber),//String(items[15]?.__EMPTY_2),
            //@ts-ignore
            ShipToNo: items[items.findIndex(val => val.__rowNum__ === 23)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 23)]?.__EMPTY_1),//String(items[17]?.__EMPTY_1),
            //@ts-ignore
            ShipStreet: items[items.findIndex(val => val.__rowNum__ === 24)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 24)]?.__EMPTY_1),//address[1]?.street,//String(items[18]?.__EMPTY_2),
            ///@ts-ignore
            ShipPostcode: items[items.findIndex(val => val.__rowNum__ === 25)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 25)]?.__EMPTY_1),//String(address[2]?.postalCode),//String(items[19]?.__EMPTY_2),
            //@ts-ignore
            ShipCountryCode: items[items.findIndex(val => val.__rowNum__ === 26)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 26)]?.__EMPTY_1),//String(address[2]?.countryCode),//String(items[20]?.__EMPTY_2),
            //@ts-ignore
            ShipPhone: items[items.findIndex(val => val.__rowNum__ === 27)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 27)]?.__EMPTY_1),//String(address[2]?.phoneNumber),//String(items[21]?.__EMPTY_2),
            //@ts-ignore
            VatNo: items[items.findIndex(val => val.__rowNum__ === 29)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 29)]?.__EMPTY_1),//String(getArrayKey(items, 'VAT No:')?.__EMPTY_1),//String(items[22]?.__EMPTY_2),
            //@ts-ignore
            GSDBID: items[items.findIndex(val => val.__rowNum__ === 30)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 30)]?.__EMPTY_1),//String(getArrayKey(items, 'GSDB ID:')?.__EMPTY_1),//String(items[23]?.__EMPTY_2),
            //@ts-ignore
            ContractName: items[items.findIndex(val => val.__rowNum__ === 33)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 33)]?.__EMPTY_1),//String(getArrayKey(items, 'First and Last Name:')?.__EMPTY_1),//String(items[23]?.__EMPTY_2),
            //@ts-ignore
            ContractEmail: items[items.findIndex(val => val.__rowNum__ === 34)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 34)]?.__EMPTY_1),//String(getArrayKey(items, 'E-mail:')?.__EMPTY_1),//String(items[25]?.__EMPTY_2),
            //@ts-ignore
            ContractPhoneno: items[items.findIndex(val => val.__rowNum__ === 35)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 35)]?.__EMPTY_1),//String(getArrayKey(items, 'Phone No:')?.__EMPTY_1),// String(items[26]?.__EMPTY_2),
            //
            ReceivingJSON: JSON.stringify(getSubTableData(items)),
            //
            Constatus: secItems[0]?.__EMPTY_1 === "Y" ? "Yes" : "No",
            ConPackagingAccno: secItems[2]?.__EMPTY_1 && String(secItems[2]?.__EMPTY_1),
            ConCompanyName: secItems[3]?.__EMPTY_1 && String(secItems[3]?.__EMPTY_1),
            ConCity: secItems[4]?.__EMPTY_1 && String(secItems[4]?.__EMPTY_1),
            ConCountryCode: secItems[5]?.__EMPTY_1 && String(secItems[5]?.__EMPTY_1),
            //
            // 需要写一个JSON 存住 Excel 62-67 行 类似于ReceivingJSON:JSON.stringify(getSubTableData(items)),
            ConsequensesJSON: JSON.stringify(getPackageData(items)),
            // 还有一个JSON 存住Excel 77-82 
            PackageJSON: JSON.stringify(getData2(items)),

            //这个日期 要日月年, 看看怎么做 这个存的时候要日期格式 
            //RequestDate:moment(String(secItems[29]?.__EMPTY_1),"dd-MM-YYYY"),
            //@ts-ignore
            RequestDate: items[items.findIndex(val => val.__rowNum__ === 117)]?.__EMPTY_1 && moment(String(items[items.findIndex(val => val.__rowNum__ === 117)]?.__EMPTY_1), "dd-MM-YYYY"),
            //IssuCompName:String(secItems[31]?.__EMPTY_1),
            //@ts-ignore
            IssuCompName: items[items.findIndex(val => val.__rowNum__ === 122)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 122)]?.__EMPTY_1),
            //@ts-ignore
            IssuName: items[items.findIndex(val => val.__rowNum__ === 123)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 123)]?.__EMPTY_1),
            //@ts-ignore
            IssuPhoneNo: items[items.findIndex(val => val.__rowNum__ === 124)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 124)]?.__EMPTY_1),
            //@ts-ignore
            IssuEmail: items[items.findIndex(val => val.__rowNum__ === 125)]?.__EMPTY_1 && String(items[items.findIndex(val => val.__rowNum__ === 125)]?.__EMPTY_1),


        }
        const sp = spfi(getSP());
        // let promiss
        addRequest({ request }).then(async promises => {
            console.log("promiss", promises, typeof (promises));
            const responseData = (promises as Record<string, any>).data;
            const id = responseData.ID;
            console.log('ID:', id);
            // console.log(promises.indexOf('ID'))
            const folderName = id;
            await sp.web.folders.addUsingPath(`Nii Case Library/${folderName}`)
            const res = await sp.web.getFolderByServerRelativePath(`Nii Case Library/${folderName}`).files.addUsingPath(sanitize(uploadFile.name), uploadFile)
            const item = await res.file.getItem()
            const contentTypes = await sp.web.lists.getByTitle('Nii Case Library').contentTypes.getContextInfo()
            console.log(contentTypes)
            // .get()
            // .then(result => {
            //   const FinalFileContentTypeId = result.filter((contenType) => {
            //     return contenType.Name === CONST.FinalFileCT;
            //   })[0].StringId;
            // @ts-ignore
            sp.web.lists.getByTitle('Nii Case Library').contentTypes()
                .then(async (result: any[]) => {
                    const UploadFileContentTypeId = result.filter((contenType) => {
                        return contenType.Name === 'uploadFile';
                    })[0].StringId;
                    //@ts-ignore
                    const finalRes = await sp.web.lists.getByTitle('Nii Case Library').items.getById(item.ID).update({
                        ContentTypeId: UploadFileContentTypeId
                    })
                }).then(() => 
                // window.location.href = webURL + "/sitepages/CollabHome.aspx"
                setbuttonVisible(false)
                );
            //sp.web.lists.getByTitle("Nii Case Library").rootFolder.folders.add(folderName.toString());
        }).catch(err => console.log("err", err));
    }


    return (
        <div className={styles.uploadPage}>
            {/* {error} */}
            {/* <div className={styles.header}>
                <Stack horizontal>
                    <Label style={{ width: "70%", fontSize: 20 }}>Create New Case</Label> 
                    <Icon style={{ fontSize: "25px" }} iconName="HomeSolid" />
                    <Link rel="www.baidu.com" style={{ textAlign: "right" }}>GO to Home Page</Link>
                </Stack>
            </div> */}
            {
          buttonvisible ?<div className={styles.content}>
                <Stack horizontal>
                    <Icon style={{ fontSize: "14px", color: '#00829B' }} iconName="Back" />
                    <span style={{ marginLeft: '8px', color: '#00829B' }} ><a href={webURL + "/sitepages/CollabHome.aspx"} style={{ color: '#00829B', fontSize: "12px" }}>Return to home</a></span>
                </Stack>
                <div className={styles.title}>Create New Case</div>
                <Stack horizontal horizontalAlign="space-between" style={{ marginBottom: '8px' }}>
                    <div className={styles.subTitle}>Upload an excel document</div>
                    {/* <div className={styles.subTitle}>*Invalid file case</div> */}
                </Stack>
                {
                    uploadFile
                        ? <Stack className={styles.uploadBox} verticalAlign="center" style={{ alignItems: 'flex-start' }}>
                            <Stack horizontal style={{ alignItems: 'center' }}>
                                <div className={styles.subTitle}>{uploadFile.name}</div>
                                <div onClick={() => {
                                    setFile(null)
                                    setData([])
                                    setError('')
                                    setfileWarning('')
                                }} style={{
                                    marginLeft: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '6px',
                                    border: '1px solid #D6D3D0',
                                    background: '#FFF',
                                    padding: '13px',
                                    cursor: 'pointer'
                                }}><Del /></div>
                            </Stack>
                        </Stack>
                        : <Stack className={styles.uploadBox} verticalAlign="center">
                            {
                                error
                                    ? <div style={{ display: 'flex', alignItems: 'center' }}><Error /> <div className={styles.subTitle} style={{ color: '#E0402E', marginLeft: '8px' }}>{error}</div></div>
                                    : <div className={styles.subTitle}>*Please contain supplier company name</div>
                            }
                            <Upload
                                beforeUpload={() => false}
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                maxCount={1}
                                showUploadList={false}
                            >
                                <Button style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '13px 34px',
                                    fontSize: '16px',
                                    borderRadius: '6px',
                                    border: '1px solid #D6D3D0',
                                    background: '#FFF'
                                }} icon={<FileSvg />}>Select files</Button>
                            </Upload>
                            {
                                fileWarning && <div style={{ display: 'flex', alignItems: 'center' }}><Error /> <div className={styles.subTitle} style={{ color: '#E0402E', marginLeft: '8px' }}>{fileWarning}</div></div>
                            }
                        </Stack>

                }

                {
                    showBtn && !error ? <> {
                        fileWarning && <div style={{ display: 'flex', alignItems: 'center', color:'green'}}><Error /> <div className={styles.subTitle} style={{ color: 'rgb(219 155 22)', marginLeft: '8px' }}>{fileWarning}</div></div>
                    }
                        <Button style={{
                            width: 140, marginTop: '32px', borderRadius: '6px', color: '#fff',
                            background: '#00829B'
                        }} onClick={() => setIsShowModal(true)}>Upload</Button></>
                        :
                        <Button style={{
                            width: 140, marginTop: '32px', borderRadius: '6px', color: '#fff',
                            background: '#C4C4C4'
                        }}>Upload</Button>
                }

            </div>: <div style={{height: '100px',  paddingTop: '64px'}}>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold'}}>
                  <div style={{marginRight: '10px', display: 'flex', alignItems: 'center'}}>
                    <Viewhistory />
                  </div>
                  Submitted!
                </p>
                <p style={{fontSize: '14px', textAlign: 'center'}}>Submitted successfully! The request will be listed in some minutes.</p>
                <Stack style={{  alignItems: 'center'}}>
                <Button style={{
                            width: 80, height: 42, marginTop: '2px', borderRadius: '6px', color: '#fff',
                            background: '#00829B',alignItems: 'center'
                        }} onClick={()=>window.location.href = webURL + "/sitepages/CollabHome.aspx" }>OK </Button></Stack>
              </div>}
            <Modal open={isShowModal} closable={false} footer={null} width={500} style={{ borderRadius: '6px', overflow: 'hidden', paddingBottom: 0 }}>
                <Stack verticalAlign="center" style={{ alignItems: 'center', paddingTop: '64px', paddingBottom: '54px' }}>
                    <p>Are you sure you want to upload this file?</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
                        <Button onClick={() => setIsShowModal(false)} style={{ width: 120, height: 42, marginTop: '32px', borderRadius: '6px' }}>Cancel</Button>
                        <Button style={{
                            width: 120, height: 42, marginTop: '32px', borderRadius: '6px', color: '#fff',
                            background: '#00829B'
                        }} onClick={() => {
                            setIsShowModal(false)
                            submitFunction()
                        }}>Yes</Button>
                    </div>
                </Stack>
            </Modal>
           
        </div>
    )





})