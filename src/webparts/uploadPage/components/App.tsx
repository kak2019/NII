/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Upload, Alert, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { useEffect } from "react";
import { mytoken } from "../UploadPageWebPart";
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
        res.push({ "Packaging account no": arr[i]['UD-KMP'], "company name":arr[i]?.__EMPTY_1,"City":arr[i]?.__EMPTY_2,'Country Code':arr[i]?.__EMPTY_3})
        i++
    }
    return res
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const validate = (json: any) => {
    if (!json['Supplier parma code']) return 'Please input parma code'
    // if(!json['Supplier']) return '请输入Supplier'
}

export default memo(function App() {
    const [items, setItems] = useState([]);
    const [data, setData] = useState({});
    const [error, setError] = useState('');
    const [parmainfo, setParmainfo] = useState<JsonData>();
    const [address, setAddress] = useState([]);
    // const [apiResponse, setApiResponse] = useState<any>(null);

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
                        'Supplier parma code': getArrayKey(jsonData, 'Supplier parma code :')?.__EMPTY_2
                    }

                    setData(json)
                    setError(validate(json))

                    if (json['Supplier parma code']) {
                        // const url = 'https://app-shared-svc-ud-parma-dev.azurewebsites.net/api/getparma/'+ json['Supplier parma code']
                        // helpers.getResponseFromAzureFunction(url, this.props.aadClient).then(data => {
                        //     console.log(data)
                        // }).catch(err => {
                        //     console.log(err)
                        // })
                        fetch('https://app-shared-svc-ud-parma-dev.azurewebsites.net/api/GetParma/' + json['Supplier parma code'], {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + mytoken
                            }
                        }).then(res => res.json()).then(res => {
                            console.log(res);
                            setParmainfo(res);
                        }).catch(error => {
                            console.log(error)
                        })
                    }
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
            console.log('Packaging account no', secItems[3].__EMPTY_2)
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
        console.log('Packaging account no', secItems[3].__EMPTY_2)
        const request = {
            PARMANo: String(items[3]?.__EMPTY_2),
            CompanyName: items[4]?.__EMPTY_2,
            ASNStreet: address[0]?.street,      //String(items[6]?.__EMPTY_2),
            ASNPostCode: String(address[0]?.postalCode),//String(items[7]?.__EMPTY_2),
            ASNCountryCode: String(address[0]?.countryCode),//String(items[8]?.__EMPTY_2),
            ASNPhone: String(address[0]?.phoneNumber),//String(items[9]?.__EMPTY_2),
            //Title:"111"
            BilltoNo: String(items[11]?.__EMPTY_2),
            BillStreet: address[1]?.street,//String(items[12]?.__EMPTY_2),
            BillPostCode: String(address[1]?.postalCode),//String(items[13]?.__EMPTY_2),
            BillCountryCode: String(address[1]?.countryCode),//String(items[14]?.__EMPTY_2),
            BillPhone: String(address[0]?.phoneNumber),//String(items[15]?.__EMPTY_2),
            //
            ShipToNo: String(items[17]?.__EMPTY_2),
            ShipStreet: address[1]?.street,//String(items[18]?.__EMPTY_2),
            ShipPostcode: String(address[2]?.postalCode),//String(items[19]?.__EMPTY_2),
            ShipCountryCode: String(address[2]?.countryCode),//String(items[20]?.__EMPTY_2),
            ShipPhone: String(address[2]?.phoneNumber),//String(items[21]?.__EMPTY_2),
            //
            VatNo: String(getArrayKey(items, 'VAT No:')?.__EMPTY_2),//String(items[22]?.__EMPTY_2),
            GSDBID: String(getArrayKey(items, 'GSDB ID:')?.__EMPTY_2),//String(items[23]?.__EMPTY_2),
            //
            ContractName: String(getArrayKey(items, 'First and Last Name:')?.__EMPTY_2),//String(items[23]?.__EMPTY_2),
            ContractEmail: String(getArrayKey(items, 'E-mail:')?.__EMPTY_2),//String(items[25]?.__EMPTY_2),
            ContractPhoneno: String(getArrayKey(items, 'Phone No:')?.__EMPTY_2),// String(items[26]?.__EMPTY_2),
            //
            ReceivingJSON:JSON.stringify(getSubTableData(items)),
            //
            Constatus:secItems[3]?.__EMPTY_2 !==null? "Yes":"No",
            ConPackagingAccno:String(secItems[3]?.__EMPTY_2),
            ConCompanyName:String(secItems[4]?.__EMPTY_2),
            ConCity:String(secItems[5]?.__EMPTY_2),
            ConCountryCode:String(secItems[6]?.__EMPTY_2),
            //
            // 需要写一个JSON 存住 Excel 62-67 行 类似于ReceivingJSON:JSON.stringify(getSubTableData(items)),
            //ConsequensesJSON:JSON.stringify()
            // 还有一个JSON 存住Excel 77-82 
            //PackageJSON:JSON.stringify()
            
            //这个日期 要日月年, 看看怎么做 这个存的时候要日期格式 
            // RequestDate:String(secItems[26]?.__EMPTY_2).
            IssuCompName:String(secItems[28]?.__EMPTY_2),
            IssuName:String(secItems[29]?.__EMPTY_2),
            IssuPhoneNo:String(secItems[30]?.__EMPTY_2),
            IssuEmail:String(secItems[31]?.__EMPTY_2),


        }
        // let promiss
        addRequest({ request }).then(promises => { console.log("promiss", promises, typeof (promises)); }).catch(err => console.log("err", err));
    }


    return (
        <>
            <Stack horizontal>
                <Label style={{ width: "70%", fontSize: 20 }}>Create New Case</Label> <Icon style={{ fontSize: "25px" }} iconName="HomeSolid" /><Link rel="www.baidu.com" style={{ textAlign: "right" }}>GO to Home Page</Link>
                {/* <Divider/> */}
            </Stack>
            <hr />
            <div>
                <Upload
                    beforeUpload={() => false}
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined rev={'form'} />}>Click to Upload</Button>
                </Upload>
                <Stack>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {
                            error && <Alert message={error} type="error" />
                        }
                    </Space>
                    <Button style={{ width: 150 }} onClick={() => submitFunction()}>Submit</Button>
                </Stack>

            </div>
        </>
    )





})