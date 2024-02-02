/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { memo, useContext } from "react";
//import { read, utils, SSF }  as XLSX from 'xlsx';
// import { useState } from "react";
// import { Button, Divider} from "antd";
import 'antd/dist/antd.css';
import { Stack } from '@fluentui/react/lib/Stack';
import { Label } from '@fluentui/react/lib/Label';
// import { Link } from "office-ui-fabric-react";
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import "@pnp/sp/items/get-all";
import { spfi } from "@pnp/sp";
import { getSP } from '../../../common/pnpjsConfig'
import { DatePicker, TextField, defaultDatePickerStrings} from '@fluentui/react';
import "@pnp/sp/webs"; 
import { PrimaryButton } from "office-ui-fabric-react";
import { mytoken } from "../CaseListWebPart";
import * as moment from "moment";
import AppContext from "../../../common/AppContext";
// interface Iitem {
//     "Case ID": string,
//     "Parma": string,
//     "Supplier Name"?: string,
//     "GSDBID": string,
//     "Creation Date": string,
//     "Start Date": string,
//     "Status": string,
// }

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function debounce(func:Function, delay: number) {
    let timerId: number;
    
    return function(...args: []) {
  
      clearTimeout(timerId);
      
      timerId = setTimeout(function() {
        func.apply(this, args);
      }, delay);
    };
  }
  

export default memo(function App() {
    const ctx = useContext(AppContext);
    const webURL = ctx.context?._pageContext?._web?.absoluteUrl;
    const sp = spfi(getSP());
    const [supplierName, setSupplierName] = React.useState('')
    const query = React.useRef({
        parma: '',
        status: ''
    })
    const colomnstyle = {
        root: {
            color: "black",
            backgroundColor: '#E9E9E9',
            '&:hover': {
                backgroundColor: '#E9E9E9',
                color: "black",
            },
            '&:active': {
                backgroundColor: '#E9E9E9',
                color: "black",
            }
        }
    }
    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'Case ID',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'CaseID',
            minWidth: 40,
            maxWidth: 80,
            styles: colomnstyle,
            onRender: (item) => (
              <a href={webURL+"/CaseForm.aspx?ID="+item.ID}>{item.CaseID}</a>
            ),
        },
        {
            key: 'column2',
            name: 'Parma',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'PARMANo',
            minWidth: 40,
            maxWidth: 80,
            styles: colomnstyle
            // onRender: (item: Iitem) => (
            //   <Text>{item.Material}</Text>
            // ),
        },
        {
            key: 'column3',
            name: 'Supplier Name',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'IssuName',
            minWidth: 60,
            maxWidth: 120,
            styles: colomnstyle
            // onRender: (item: Iitem) => (
            //   <Text>{item.Material}</Text>
            // ),
        },
        {
            key: 'column4',
            name: 'GSDBID',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'GSDBID',
            minWidth: 60,
            maxWidth: 80,
            styles: colomnstyle
            // onRender: (item: Iitem) => (
            //   <Text>{item.Material}</Text>
            // ),
        }, {
            key: 'column4',
            name: 'Creation Date',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'Created',
            minWidth: 60,
            maxWidth: 120,
            styles: colomnstyle
            // onRender: (item: Iitem) => (
            //   <Text>{item.Material}</Text>
            // ),
        }, {
            key: 'column4',
            name: 'Start Date',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'RequestDate',
            minWidth: 60,
            maxWidth: 120,
            styles: colomnstyle
            // onRender: (item: Iitem) => (
            //   <Text>{item.Material}</Text>
            // ),
        }, {
            key: 'column4',
            name: 'Status',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'Status',
            minWidth: 60,
            maxWidth: 80,
            styles: colomnstyle,
            onRender: (item) => (
            <span style={{color:'red',background:"green"}}>{item?.Status}</span>
            ),
        }]

        const allItems = React.useRef([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [items, setItems] = React.useState([{
        "Case ID": "1223",
        "Parma": "110",
        "Supplier Name": "FLynt",
        "GSDBID": "001",
        "Creation Date": "09-02-1999",
        "Start Date": "04-09-2032",
        "Status": "OK"

    }]);
    // setItems([{
    //     "Case ID": "1223",
    //     "Parma": "110",
    //     "Supplier Name": "FLynt",
    //     "GSDBID": "001",
    //     "Creation Date": "09-02-1999",
    //     "Start Date": "04-09-2032",
    //     "Status": "OK"

    // }])
    const Statusoptions: IDropdownOption[] = [
        { key: 'Case Created', text: 'Case Created' },
        { key: 'In Contract Sign Off Process', text: 'In Contract Sign Off Process' },
        { key: 'Contract Submitted', text: 'Contract Submitted' },
        { key: 'Case Approved', text: 'Case Approved' },
        { key: 'Case Rejected', text: 'Case Rejected' },
        { key: 'All Case', text: 'All Case' },
    ];

    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 250, marginRight: 40 },
    };
    const array: IDropdownOption[] = [];
    const Countryoptions: IDropdownOption[] = []
    const [countryoption,setcountryoption] = React.useState<IDropdownOption[]>([])
    React.useEffect(() => {
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
            console.log("res", response)
            if (response.Row.length > 0) {
                allItems.current = response.Row
                setItems(response.Row)
            }
        }
    
        );
        const itemoptionContry = sp.web.lists.getByTitle("Country").renderListDataAsStream({
            ViewXml: `<View>
                              <ViewFields>
                                <FieldRef Name="Title"/>
                                <FieldRef Name="CountryCode"/>
                              </ViewFields>
                              <RowLimit>400</RowLimit>
                            </View>`,
        }).then((response) => {
            console.log("res", response)
            if (response.Row.length > 0) {
                for (let i = 0; i < response.Row.length; i++) {
                    Countryoptions.push({ key: response.Row[i].Title, text: response.Row[i].Title })
                }
                setcountryoption(Countryoptions)
                console.log("array", Countryoptions);
                console.log(itemoptionContry);
            }
        }
        )
    }, [])


   
    // 变量拼起来 空格会导致搜索不到
    //const temp_Address = sp.web.lists.getByTitle("Entities").items.select("Title","Country","Address").filter(`Name eq ${(taregetID)}`).getAll();

   const fetchName: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val: string) => void  = debounce((e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val: string) => {
        query.current.parma = val    
        if(val) {
            fetch('https://app-shared-svc-ud-parma-dev.azurewebsites.net/api/GetParma/' + val, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + mytoken
            }
            }).then(res => res.json()).then(res => {
                setSupplierName(res.internationalVersion.originalName)
            }).catch(error => {
                console.log(error)
            })
        }
   }, 500)

   const handleStatus = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any>, index?: number) => {
        query.current.status = option.key as string
   }

   const handleSearch = () => {
        setItems(allItems.current.filter(val => {
            let condition = true
            if(query.current.parma) {
                condition = condition && val.PARMANo === query.current.parma
            }
            if(query.current.status) {
                condition = condition && val.Status === query.current.status
            }
            return condition
        }))
   }
   function formatDate(date: Date): string {
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString(); // getMonth() 返回 0-11
        const year = date.getFullYear().toString();
    
        // 确保日和月始终是两位数字
        day = day.length < 2 ? '0' + day : day;
        month = month.length < 2 ? '0' + month : month;
    
        return `${day}-${month}-${year}`;
    }
    
  
    return (
        <><section style={{backgroundColor:'rgba(248, 247, 246, 1)', borderRadius: 10}}>
            <Stack >
                <Label style={{ fontSize: 18 }}>NII Case List</Label>

            </Stack>

            <Stack horizontal horizontalAlign="start" style={{ marginBottom: 10 }}>
                <Label style={{ width: 60 }}>Status</Label>
                <Dropdown
                    placeholder="Select an option"
                    // label="Status"
                    options={Statusoptions}
                    styles={dropdownStyles}
                    onChange={handleStatus}
                />  {"   "}
                <Label style={{ width: 60 }}>Country </Label><Dropdown
                    placeholder="Select an option"
                    //   label="Country"
                    options={countryoption}
                    styles={dropdownStyles}
                />
            </Stack >
            <Stack horizontal horizontalAlign="start" style={{ marginRight: 20 }}>
                <Label style={{ width: 60 }}>Parma</Label> <TextField style={{ width: 250 }} onChange={fetchName} />{" "}
                <Label style={{ width: 100, marginRight: 10, marginLeft: 40 }}>Supplier Name</Label> 
                <Label>{ supplierName  }</Label>
            </Stack>
            <Stack horizontal horizontalAlign="start" style={{marginTop:10}}>
                <Label style={{marginRight:20}}>Plan Start Date</Label><Label style={{marginLeft:20,marginRight:20}}>from</Label>
                <DatePicker
                    placeholder="Select a date..."
                    ariaLabel="Select a date"
                    style={{width:200}}
                    // DatePicker uses English strings by default. For localized apps, you must override this prop.
                    strings={defaultDatePickerStrings}
                    formatDate={formatDate}
                /><Label style={{marginLeft:20,marginRight:20}}>to</Label>
                <DatePicker
                placeholder="Select a date..."
                ariaLabel="Select a date"
                style={{width:200}}
                formatDate={formatDate}
                // DatePicker uses English strings by default. For localized apps, you must override this prop.
                strings={defaultDatePickerStrings}
            />
            </Stack>
            <Stack horizontal horizontalAlign="end" style={{marginTop:10}}>
                <PrimaryButton onClick={handleSearch} style={{marginRight:10,color:"red"}}>Search</PrimaryButton>
                <PrimaryButton>Reset</PrimaryButton>
            </Stack>
            </section>
            <DetailsList
                items={items}

                columns={columns}
                selectionMode={SelectionMode.none}
                setKey="multiple"
                layoutMode={DetailsListLayoutMode.justified}
                isHeaderVisible={true}
                selectionPreservedOnEmptyClick={true}

                enterModalSelectionOnTouch={true}

                checkButtonAriaLabel="select row"
            />

        </>
    )





})