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
import { Link } from "office-ui-fabric-react";
// 定义 Excel 文件中数据的类型
// interface IexcelData {
//     PARMANo: string;
//     CompanyName: string;
//     ASNStreet: string;
//     ASNPostCode: string;
//     ASNCountryCode: string;
//     ASNPhone: string
// }

export default memo(function App() {
    const [items, setItems] = useState([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files[0];
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
            }
        };
        reader.readAsBinaryString(file);

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
        <Stack>
            <Label>Create New Case</Label> <Link rel="www.baidu.com">GO to Home Page</Link>
            <Divider/>
            </Stack>
           
            <div>
                {/* <Upload 
                beforeUpload={() => false}
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    > */}
                    {/* <Button onChange={handleFileUpload}>Click to Upload</Button> */}
                    <input type="file" onChange={handleFileUpload} />
                    {/* <Button onChange={handleFileUpload}>Click to Upload</Button> */}
                    {/* <Button >Click to Upload</Button> */}
               
                {/* </Upload> */}
                <Stack>
                <Button onClick={() => submitFunction()}>Submit</Button>
                </Stack>
                
            </div>
        </>
    )





})