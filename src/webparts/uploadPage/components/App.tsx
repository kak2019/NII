/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import * as React from "react";
import { memo } from "react";
//import { read, utils, SSF }  as XLSX from 'xlsx';
import * as XLSX from 'xlsx';
import { useState } from "react";
import { Button, Divider } from "antd";
import { addRequest } from "./utils/request";
import 'antd/dist/antd.css';
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';
import { Icon, Link } from "office-ui-fabric-react";
import { Icon as IconBase } from '@fluentui/react/lib/Icon';
import { Upload, Alert, Space } from 'antd';
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
        res.push({ "Packaging account no": arr[i]['UD-KMP'], "company name":arr[i]?.__EMPTY,"City":arr[i]?.__EMPTY_1,'Country Code':arr[i]?.__EMPTY_2})
        i++
    }
    return res
}

// 获取61-66
const getPackageData = (arr: Array<{ [key in string]: any }>) => {
    // @ts-ignore 
    const start = arr.findIndex(val => val.__rowNum__ === 59)
    // @ts-ignore eslint-disable-next-line
    const end = arr.findIndex(val => val.__rowNum__ === 67)

    return arr.slice(start + 1, end).map(val => {
        return { "Packaging": val['__EMPTY_1'], "Packaging Name":val.__EMPTY_2,"Yearly need":val.__EMPTY_3}
    })
}

// 获取76-85
const getData2 = (arr: Array<{ [key in string]: any }>) => {
    // @ts-ignore 
    const start = arr.findIndex(val => val.__rowNum__ === 74)
    // @ts-ignore eslint-disable-next-line
    const end = arr.findIndex(val => val.__rowNum__ === 86)

    const table1 = arr.slice(start + 1, end).map(val => {
        return { 
            "Packaging": val['UD-KMP'], 
            "weekly need":val.__EMPTY,
            "Packaging Name": val['__EMPTY_4'],
            "Yearly need":val['Mandatory field'],
        }
    })
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
const validate = (json: any) => {
    if (!json['Supplier parma code']) return 'Please input parma code';
    if (!json['Company name']) return 'Please input Company Name';
    // if(!json['Supplier']) return '请输入Supplier'
}

export default memo(function App() {
    const [items, setItems] = useState([]);
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [parmainfo, setParmainfo] = useState<JsonData>();
    const [address, setAddress] = useState([]);
    const [showBtn, setShowBtn] = useState(false)
    const [file, setFile] = useState()
    // const [apiResponse, setApiResponse] = useState<any>(null);



   
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleFileUpload = (info: any) => {
        if (info.file) {
            const file = info.file
            if (!file) return;

            setFile(file)
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
                    setError(validate(json));
                    console.log("error",error,validate(json));
                    console.log("json['Supplier parma code']",json['Supplier parma code'])

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
                    setShowBtn(true)
                    
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
            console.log("新写法",items[items.findIndex(val => val.__rowNum__ === 55)])
        }
    }, [parmainfo, address])

    const submitFunction = async (): Promise<void> => {
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
            PARMANo: String(items[3]?.__EMPTY_1),
            CompanyName: items[4]?.__EMPTY_1,
            //@ts-ignore
            ASNStreet: String(items[items.findIndex(val => val.__rowNum__ === 10)]?.__EMPTY_1),//address[0]?.street,      //String(items[6]?.__EMPTY_2),
            //@ts-ignore
            ASNPostCode: String(items[items.findIndex(val => val.__rowNum__ === 11)]?.__EMPTY_1),//String(address[0]?.postalCode),//String(items[7]?.__EMPTY_2),
            //@ts-ignore
            ASNCountryCode:String(items[items.findIndex(val => val.__rowNum__ === 12)]?.__EMPTY_1),// String(address[0]?.countryCode),//String(items[8]?.__EMPTY_2),
            //@ts-ignore
            ASNPhone:String(items[items.findIndex(val => val.__rowNum__ === 13)]?.__EMPTY_1),// String(address[0]?.phoneNumber),//String(items[9]?.__EMPTY_2),
            //Title:"111"
            //@ts-ignore
            BilltoNo: String(items[items.findIndex(val => val.__rowNum__ === 16)]?.__EMPTY_1),
            //@ts-ignore
            BillStreet: String(items[items.findIndex(val => val.__rowNum__ === 17)]?.__EMPTY_1),//address[1]?.street,//String(items[12]?.__EMPTY_2),
           //@ts-ignore
            BillPostCode: String(items[items.findIndex(val => val.__rowNum__ === 18)]?.__EMPTY_1),//String(address[1]?.postalCode),//String(items[13]?.__EMPTY_2),
            //@ts-ignore
            BillCountryCode: String(items[items.findIndex(val => val.__rowNum__ === 19)]?.__EMPTY_1),//String(address[1]?.countryCode),//String(items[14]?.__EMPTY_2),
            //@ts-ignore
            BillPhone:String(items[items.findIndex(val => val.__rowNum__ === 20)]?.__EMPTY_1),// String(address[0]?.phoneNumber),//String(items[15]?.__EMPTY_2),
            //@ts-ignore
            ShipToNo: String(items[items.findIndex(val => val.__rowNum__ === 23)]?.__EMPTY_1),//String(items[17]?.__EMPTY_1),
            //@ts-ignore
            ShipStreet: String(items[items.findIndex(val => val.__rowNum__ === 24)]?.__EMPTY_1),//address[1]?.street,//String(items[18]?.__EMPTY_2),
            ///@ts-ignore
            ShipPostcode: String(items[items.findIndex(val => val.__rowNum__ === 25)]?.__EMPTY_1),//String(address[2]?.postalCode),//String(items[19]?.__EMPTY_2),
            //@ts-ignore
            ShipCountryCode: String(items[items.findIndex(val => val.__rowNum__ === 26)]?.__EMPTY_1),//String(address[2]?.countryCode),//String(items[20]?.__EMPTY_2),
            //@ts-ignore
            ShipPhone: String(items[items.findIndex(val => val.__rowNum__ === 27)]?.__EMPTY_1),//String(address[2]?.phoneNumber),//String(items[21]?.__EMPTY_2),
            //@ts-ignore
            VatNo: String(items[items.findIndex(val => val.__rowNum__ === 29)]?.__EMPTY_1),//String(getArrayKey(items, 'VAT No:')?.__EMPTY_1),//String(items[22]?.__EMPTY_2),
            //@ts-ignore
            GSDBID: String(items[items.findIndex(val => val.__rowNum__ === 30)]?.__EMPTY_1),//String(getArrayKey(items, 'GSDB ID:')?.__EMPTY_1),//String(items[23]?.__EMPTY_2),
            //@ts-ignore
            ContractName: String(items[items.findIndex(val => val.__rowNum__ === 33)]?.__EMPTY_1),//String(getArrayKey(items, 'First and Last Name:')?.__EMPTY_1),//String(items[23]?.__EMPTY_2),
            //@ts-ignore
            ContractEmail: String(items[items.findIndex(val => val.__rowNum__ === 34)]?.__EMPTY_1),//String(getArrayKey(items, 'E-mail:')?.__EMPTY_1),//String(items[25]?.__EMPTY_2),
            //@ts-ignore
            ContractPhoneno: String(items[items.findIndex(val => val.__rowNum__ === 35)]?.__EMPTY_1),//String(getArrayKey(items, 'Phone No:')?.__EMPTY_1),// String(items[26]?.__EMPTY_2),
            //
            ReceivingJSON:JSON.stringify(getSubTableData(items)),
            //
            Constatus:secItems[0]?.__EMPTY_1 !=="Y"? "Yes":"No",
            ConPackagingAccno:String(secItems[2]?.__EMPTY_1),
            ConCompanyName:String(secItems[3]?.__EMPTY_1),
            ConCity:String(secItems[4]?.__EMPTY_1),
            ConCountryCode:String(secItems[5]?.__EMPTY_1),
            //
            // 需要写一个JSON 存住 Excel 62-67 行 类似于ReceivingJSON:JSON.stringify(getSubTableData(items)),
            ConsequensesJSON:JSON.stringify(getPackageData(items)),
            // 还有一个JSON 存住Excel 77-82 
            PackageJSON:JSON.stringify(getData2(items)),
            
            //这个日期 要日月年, 看看怎么做 这个存的时候要日期格式 
            //RequestDate:moment(String(secItems[29]?.__EMPTY_1),"dd-MM-YYYY"),
            //@ts-ignore
            RequestDate:moment(String(items[items.findIndex(val => val.__rowNum__ === 102)]?.__EMPTY_1),"dd-MM-YYYY"),
            //IssuCompName:String(secItems[31]?.__EMPTY_1),
            //@ts-ignore
            IssuCompName:String(items[items.findIndex(val => val.__rowNum__ === 107)]?.__EMPTY_1),
            //@ts-ignore
            IssuName:String(items[items.findIndex(val => val.__rowNum__ === 108)]?.__EMPTY_1),
            //@ts-ignore
            IssuPhoneNo:String(items[items.findIndex(val => val.__rowNum__ === 109)]?.__EMPTY_1),
            //@ts-ignore
            IssuEmail:String(items[items.findIndex(val => val.__rowNum__ === 110)]?.__EMPTY_1),


        }
        const sp = spfi(getSP());
        // let promiss
        addRequest({ request }).then(promises => { console.log("promiss", promises, typeof (promises));
        const responseData = (promises as Record<string, any>).data;
        const id = responseData.ID;
        console.log('ID:', id);
        // console.log(promises.indexOf('ID'))
         const folderName = id;
        sp.web.folders.addUsingPath(`Nii Case Library/${folderName}`);
    //sp.web.lists.getByTitle("Nii Case Library").rootFolder.folders.add(folderName.toString());
    }).catch(err => console.log("err", err));
    }
   

    return (
        <div className={styles.uploadPage}>
            {error}
            {/* <div className={styles.header}>
                <Stack horizontal>
                    <Label style={{ width: "70%", fontSize: 20 }}>Create New Case</Label> 
                    <Icon style={{ fontSize: "25px" }} iconName="HomeSolid" />
                    <Link rel="www.baidu.com" style={{ textAlign: "right" }}>GO to Home Page</Link>
                </Stack>
            </div> */}
            <div className={styles.content}>
                <Stack horizontal>
                    <Icon style={{ fontSize: "12px", color: '#00829B' }} iconName="Back" />
                    <span style={{marginLeft: '4px', color: '#00829B'}} ><a href="www.baidu.com">Return to home</a></span>
                </Stack>
                <div className={styles.title}>Create new case</div>
                <Stack horizontal horizontalAlign="space-between" style={{marginBottom: '8px'}}>
                    <div className={styles.subTitle}>Upload an excel document</div>
                    {/* <div className={styles.subTitle}>*Invalid file case</div> */}
                </Stack>
                {
                    file 
                    ? <Stack className={styles.uploadBox} verticalAlign="center" style={{alignItems: 'flex-start'}}>
                        <Stack horizontal style={{alignItems: 'center'}}>
                            <div className={styles.subTitle}>Upload an excel document</div>
                            <div onClick={() => {
                                setFile(null)
                                setData([])
                                setError('')
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
                            ? <div style={{display: 'flex', alignItems: 'center'}}><Error /> <div className={styles.subTitle} style={{color: '#E0402E', marginLeft: '8px'}}>Please provide valid company name</div></div>
                            :<div className={styles.subTitle}>*Please contain supplier company name</div>
                        }
                    <Upload
                        beforeUpload={() => false}
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        maxCount={1}
                    >
                        <Button style={{
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '12px', 
                            padding: '13px 34px',
                            fontSize: '16px',
                            borderRadius: '6px',
                            border: '1px solid #D6D3D0',
                            background: '#FFF'}} icon={<FileSvg />}>Select files</Button>
                    </Upload>
                </Stack>

                }
                
                {
                    showBtn ? 
                        <Button style={{ width: 140, marginTop: '32px', borderRadius: '6px',color: '#fff',
                        background: '#00829B' }} onClick={() => submitFunction()}>Upload</Button> :
                        <Button style={{ width: 140, marginTop: '32px', borderRadius: '6px', color: '#fff',
                        background: '#C4C4C4' }}>Upload</Button>
                }

            </div>
        </div>
    )





})