/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { memo } from "react";
//import { read, utils, SSF }  as XLSX from 'xlsx';
import * as XLSX from 'xlsx';
import {useState } from "react";

// 定义 Excel 文件中数据的类型


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
            }
        };
        reader.readAsBinaryString(file);
    };


    return(
        <>
        看见就是成功
        <div>
            <input type="file" onChange={handleFileUpload} />
            <table>
                {items.map((item, index) => (
                    <tr key={index}>
                        {Object.keys(item).map((val, idx) => (
                            <td key={idx}>{val}</td>
                        ))}
                    </tr>
                ))}
            </table>
        </div>
        </>
    )


    


})