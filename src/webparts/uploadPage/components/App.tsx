/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { memo } from "react";
//import { read, utils, SSF }  as XLSX from 'xlsx';
import * as XLSX from 'xlsx';
import { useState } from "react";
import { Button, Divider} from "antd";
import { addRequest } from "./utils/request";
import 'antd/dist/antd.css';
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';
import { Icon, Link } from "office-ui-fabric-react";
import { Upload, Alert, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getArrayKey = (arr: Array<{ [key in string]: any }>, key: string) => {
    for(let i =0; i< arr.length; i++) {
        if(arr[i]['UD-KMP'] === key) {
            return arr[i]
        }
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getSubTableData = (arr: Array<{ [key in string]: any }>) => {
    let i = 30
    const res = []
    while(arr[i]['UD-KMP'] !== "CONSEQUENSES FOR OTHER SUPPLIERS?:") {
        res.push(arr[i])
        i++
    }
    return res
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const validate = (json: any) => {
    if(!json['Supplier parma code']) return '请输入parma code'
    // if(!json['Supplier']) return '请输入Supplier'
}

export default memo(function App() {
    const [items, setItems] = useState([]);
    const [data, setData] = useState({})
    const [error, setError] = useState('')

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

                    if(json['Supplier parma code']) {
                        // const url = 'https://app-shared-svc-ud-parma-dev.azurewebsites.net/api/getparma/'+ json['Supplier parma code']
                        // helpers.getResponseFromAzureFunction(url, this.props.aadClient).then(data => {
                        //     console.log(data)
                        // }).catch(err => {
                        //     console.log(err)
                        // })
                        fetch('https://app-shared-svc-ud-parma-dev.azurewebsites.net/api/GetParma/'+ json['Supplier parma code']).then(res => res.json()).then(res => {
                            console.log(res)
                        }).catch(error => {
                            console.log(error)
                        })
                    }
                }
            };
            reader.readAsBinaryString(file);
        }
    };
    if (items.length > 0) {
        console.log('Supplier parma code: ', items[3]?.__EMPTY_2);
        console.log('Company Name: ', items[4]?.__EMPTY_2);
        console.log('Street / P.O. Box: ', items[6]?.__EMPTY_2);
        console.log("Postal Code and City", items[7]?.__EMPTY_2);
        console.log("Country Code:", items[8]?.__EMPTY_2);
        console.log("Phone No:", items[9]?.__EMPTY_2);
        console.log("Supplier parma code :", items[11]?.__EMPTY_2);
        console.log("Street / P.O. Box", items[12]?.__EMPTY_2);
        console.log("Postal Code and City", items[13]?.__EMPTY_2);
        console.log("Country Code:", items[14]?.__EMPTY_2);
        console.log("Phone No:", items[15]?.__EMPTY_2);
        console.log("Supplier parma code :", items[17]?.__EMPTY_2);
        console.log("Street / P.O. Box", items[18]?.__EMPTY_2);
        console.log("Postal Code and City", items[19]?.__EMPTY_2);
        console.log("Country Code:", items[20]?.__EMPTY_2);
        console.log("Phone No:", items[21]?.__EMPTY_2);
        console.log("VAT No:", items[22]?.__EMPTY_2);
        console.log("GSDB ID:", items[23]?.__EMPTY_2);
        console.log("First and Last Name:", items[25]?.__EMPTY_2);
        console.log("E-mail:", items[26]?.__EMPTY_2);
        console.log("Line1", items[30]["UD-KMP"], items[30]?.__EMPTY_1, items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        console.log("Line2", items[31]["UD-KMP"], items[30]?.__EMPTY_1, items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);

        // 获取子表数据项
        console.log(getSubTableData(items))
        // 获取普通数据项
        console.log(getArrayKey(items, 'E-mail:'))

        // 子表后面的数据
        let index = 0
        for(let i =0; i< items.length; i++) {
            if(items[i]['UD-KMP'] === 'CONSEQUENSES FOR OTHER SUPPLIERS?:') {
                index = i
                break
            }
        }
        // 获取不固定子表后面的数据
        const secItems = items.slice(index)
        console.log('Packaging account no', secItems[3].__EMPTY_2)
        
        // 一共固定是十行 到时候在考虑怎么拿取数据
        // console.log("Line3",items[32]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Line4",items[30]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Line5",items[30]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Line6",items[30]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Line7",items[30]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Line8",items[30]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Line9",items[30]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Line10",items[30]["UD-KMP"],items[30]?.__EMPTY_1,items[30]?.__EMPTY_2, items[30]?.__EMPTY_3);
        // console.log("Phone No:",items[15]?.__EMPTY_2);
        // console.log("Phone No:",items[15]?.__EMPTY_2);
        // console.log("Phone No:",items[15]?.__EMPTY_2);
        // console.log("Phone No:",items[15]?.__EMPTY_2);


    }
    function getResponseFromAzureFunction(apiUri: string,aadClient:AadHttpClient): Promise<any> {
        return aadClient.get(apiUri, AadHttpClient.configurations.v1)
            .then((rawResponse: HttpClientResponse) => {
                return rawResponse.json();
            })
            .then((jsonResponse) => {
                return jsonResponse;
            }) as Promise<any>;
    }
    const submitFunction = async (): Promise<void> => {
        const request = {
            PARMANo: String(items[3]?.__EMPTY_2),
            CompanyName: items[4]?.__EMPTY_2,
            ASNStreet: String(items[6]?.__EMPTY_2),
            ASNPostCode: String(items[7]?.__EMPTY_2),
            ASNCountryCode: String(items[8]?.__EMPTY_2),
            ASNPhone: String(items[9]?.__EMPTY_2),
            //Title:"111"
            BilltoNo: String(items[11]?.__EMPTY_2),
            BillStreet: String(items[12]?.__EMPTY_2),
            BillPostCode: String(items[13]?.__EMPTY_2),
            BillCountryCode: String(items[14]?.__EMPTY_2),
            BillPhone: String(items[15]?.__EMPTY_2),
            //
            ShipToNo: String(items[17]?.__EMPTY_2),
            ShipStreet: String(items[18]?.__EMPTY_2),
            ShipPostcode: String(items[19]?.__EMPTY_2),
            ShipCountryCode: String(items[20]?.__EMPTY_2),
            ShipPhone: String(items[21]?.__EMPTY_2),
            //
            VatNo:String(items[22]?.__EMPTY_2),
            GSDBID:String(items[23]?.__EMPTY_2),
            //
            ContractName:String(items[23]?.__EMPTY_2),
            ContractEmail:String(items[25]?.__EMPTY_2),
            ContractPhoneno:String(items[26]?.__EMPTY_2),
            //

        }
        // let promiss
        addRequest({ request }).then(promises => { console.log("promiss", promises, typeof (promises));}).catch(err => console.log("err", err));
    }


    return (
        <>
        <Stack horizontal>
            <Label style={{width:"70%",fontSize:20}}>Create New Case</Label> <Icon style={{fontSize:"25px"}} iconName="HomeSolid"/><Link rel="www.baidu.com" style={{textAlign:"right"}}>GO to Home Page</Link>
            {/* <Divider/> */}
            </Stack>
           <hr/>
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
                <Button style={{width:150}} onClick={() => submitFunction()}>Submit</Button>
                </Stack>
                
            </div>
        </>
    )





})