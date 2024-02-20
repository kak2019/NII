/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { memo, useContext, useState } from "react";
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
import { DatePicker, TextField, defaultDatePickerStrings } from '@fluentui/react';
import { IDatePickerStyles, ITextFieldStyles, Icon} from "office-ui-fabric-react";
import "@pnp/sp/webs";
// import { PrimaryButton } from "office-ui-fabric-react";
import { mytoken } from "../CaseListWebPart";
import * as moment from "moment";
import AppContext from "../../../common/AppContext";
import styles from './CaseList.module.scss'
import { Button, Pagination } from "antd";
import type { PaginationProps } from "antd";
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
function debounce(func: Function, delay: number) {
    let timerId: number;

    return function (...args: []) {

        clearTimeout(timerId);

        timerId = setTimeout(function () {
            func.apply(this, args);
        }, delay);
    };
}


export default memo(function App() {
    const ctx = useContext(AppContext);
    const webURL = ctx.context?._pageContext?._web?.absoluteUrl;
    const sp = spfi(getSP());
    const [supplierName, setSupplierName] = React.useState('')
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedKeycontry, setSelectedKeyCountry] = useState(null)
    const [textFieldValue, setTextFieldValue] = useState("");
    const [selectedDateFrom, setSelectedDateFrom] = useState(null);
    const [selectedDateTo, setSelectedDateTo] = useState(null);
    const query = React.useRef({
        parma: '',
        status: '',
        country: '',
        start: '',
        end: ''
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
                <a href={webURL + "/sitepages/CaseForm.aspx?caseid=" + item.ID}>{item.CaseID}</a>
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
            styles: colomnstyle,
            onRender: (item) => (
                <span>{item.Created ? moment(item.Created).format("DD-MM-YYYY") : ""}</span>
            ),
        }, {
            key: 'column4',
            name: 'Start Date',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'RequestDate',
            minWidth: 60,
            maxWidth: 120,
            styles: colomnstyle,
            onRender: (item) => (
                <span>{item.RequestDate ? moment(item.RequestDate).format("DD-MM-YYYY") : ""}</span>
            ),
        }, {
            key: 'column4',
            name: 'Country',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'ASNCountryCode',
            minWidth: 60,
            maxWidth: 120,
            styles: colomnstyle,
            // onRender: (item) => (
            //     <span>{item.RequestDate ? moment(item.RequestDate).format("DD-MM-YYYY") : ""}</span>
            // ),
        },{
            key: 'column4',
            name: 'Status',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'Status',
            minWidth: 60,
            maxWidth: 80,
            styles: colomnstyle,
            onRender: (item) => {
                let color = '#fff'
                let border = ''
                let backgroundColor = "#fff"
                switch (item.Status) {
                    case 'Case Created': {
                        color = '#00829B'
                        border = '1px solid #00829B'
                        break
                    }
                    case 'Contract Submitted': {
                        backgroundColor = "#0077C7"
                        break
                    }
                    case 'Case Approved': {
                        backgroundColor = "#11A38B"
                        break
                    }
                    case 'Case Rejected': {
                        backgroundColor = "#E01E5A"
                        break
                    }
                    case 'In Contract Sign Off Process': {
                        backgroundColor = "#F78C29"
                        break
                    }
                }
                return (
                    <span style={{ color, backgroundColor, border, fontSize: '14px', padding: '5px 9px' }}>{item?.Status}</span>
                )
            },
        }]

    const allItems = React.useRef([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [items, setItems] = React.useState([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [itemsCopy, setItemsCopy] = React.useState([{}]);
    const [page, setPage] = React.useState(1)
    const handlePageChange: PaginationProps['onChange'] = (page) => {
        setPage(page)
    }
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
        { key: 'All', text: 'All' },
        { key: 'Case Created', text: 'Case Created' },
        { key: 'In Contract Sign Off Process', text: 'In Contract Sign Off Process' },
        { key: 'Contract Submitted', text: 'Contract Submitted' },
        { key: 'Case Approved', text: 'Case Approved' },
        { key: 'Case Rejected', text: 'Case Rejected' },

    ];

    const dropdownStyles: Partial<IDropdownStyles> = {
        root: { background: '#fff', display: 'flex', flexShrink: 0, alignItems: 'center', width: 230, marginRight: 60, fontSize: '14px', height: 42, color: '#191919', border: '1px solid #454545', borderRadius: '10px' },
        dropdown: { ':focus::after': { border: 'none' }, width: 230 },
        title: { border: 'none', background: 'none' }
    };
    const textStyles: Partial<ITextFieldStyles> = {
        root: { background: '#fff', display: 'flex', flexShrink: 0, alignItems: 'center', width: 230, marginRight: 60, fontSize: '14px', height: 42, color: '#191919', border: '1px solid #454545', borderRadius: '10px' },
        fieldGroup: { border: 'none', background: 'none', '::after': { border: 'none' } }
    }

    const datePickerStyles: Partial<IDatePickerStyles> = {
        // root: { background: '#fff', display: 'flex',flexShrink: 0, alignItems: 'center', width: 260, marginRight: 60, fontSize: '14px', height: 42, color: '#191919', border: '1px solid #454545', borderRadius: '10px' },
        textField: { background: '#fff', display: 'flex', flexShrink: 0, alignItems: 'center', width: 260, marginRight: 30, fontSize: '14px', height: 42, color: '#191919', border: '1px solid #454545', borderRadius: '10px' },
        // fieldGroup: { border: 'none', background: 'none', '::after': { border: 'none'} }
    }

    const datePickerTextStyles = {
        root: { background: '#fff', display: 'flex', flexShrink: 0, alignItems: 'center', marginRight: 30, fontSize: '14px', height: 42, color: '#191919' },
        fieldGroup: { width: 260, border: 'none', background: 'none', '::after': { border: 'none' } }
    }

    const array: IDropdownOption[] = [];
    const Countryoptions: IDropdownOption[] = []
    const [countryoption, setcountryoption] = React.useState<IDropdownOption[]>([])
    const [showInitData , setshowInitData] = React.useState(false)
    React.useEffect(() => {
        // const itemoption = sp.web.lists.getByTitle("Nii Cases").renderListDataAsStream({
        //     ViewXml: `<View>
        //                       <ViewFields>
        //                         <FieldRef Name="CaseID"/>
        //                         <FieldRef Name="PARMANo"/>
        //                         <FieldRef Name="IssuName"/>
        //                         <FieldRef Name="GSDBID"/>
        //                         <FieldRef Name="RequestDate"/>
        //                         <FieldRef Name="Status"/>
        //                         <FieldRef Name="Created"/>
        //                         <FieldRef Name="ASNCountryCode"/>
        //                       </ViewFields>
                           
        //                     </View>`,
        //     // <RowLimit>400</RowLimit>
        // }).then((response) => {
        //     console.log("res", response)
        //     if (response.Row.length > 0) {
        //         allItems.current = response.Row
        //         setItems(response.Row);
        //         setItemsCopy(response.Row)
        //     }
        // }

        // );
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
React.useEffect(()=>{
    initdata()
},[showInitData])


    // 变量拼起来 空格会导致搜索不到
    //const temp_Address = sp.web.lists.getByTitle("Entities").items.select("Title","Country","Address").filter(`Name eq ${(taregetID)}`).getAll();

    const fetchName: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val: string) => void = debounce((e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, val: string) => {
        query.current.parma = val
        setTextFieldValue(val)
        if (val) {
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
                setSupplierName("-")
            })
        }
    }, 100)

    const handleStatus = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any>, index?: number) => {
        query.current.status = option.key as string;
        setSelectedKey(option.key)
    }
    const handleCty = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any>, index?: number) => {
        query.current.country = option.key as string;
        setSelectedKeyCountry(option.key)
    }

    const handleStart = (date: Date | null | undefined) => {
        query.current.start = moment(date).format('yyyy-MM-DD')
        console.log(query.current.start)
        setSelectedDateFrom(date)
    }
    const handleEnd = (date: Date | null | undefined) => {

        query.current.end = moment(date).format('yyyy-MM-DD')
        console.log(typeof (query.current.end), query.current.end)
        setSelectedDateTo(date)
    }
    function initdata(){
        if(showInitData){
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
            setItems(response.Row.sort((a,b)=>b.CaseID - a.CaseID));
            setItemsCopy(response.Row)
        }
    }

    );
}
    }
    const handleSearch = () => {
        setshowInitData(true)
        console.log("querryparma",query.current.parma)
        console.log("status",query.current.status)
        console.log("country",query.current.country)
        console.log("start-end",query.current.start,query.current.end)
        
        // setItems(allItems.current.filter(val => {
        //     let condition = true
        //     if (query.current.parma) {
        //         condition = condition && val.PARMANo === query.current.parma
        //     }
        //     if (query.current.status && query.current.status !== 'All') {
        //         condition = condition && val.Status === query.current.status
        //     }
        //     if (query.current.country) {
        //         condition = condition && val.ASNCountryCode === query.current.country.toUpperCase()
        //     }
        //     if (query.current.start && query.current.end) {
        //         const aa = moment(val.RequestDate, 'yyyy/MM/DD').isBetween(query.current.start, query.current.end)
        //         // console.log("moment",typeof(aa),aa)
        //         // console.log("moment(query.current.start)",typeof(query.current.start))
        //         // console.log("req",moment(val?.RequestDate,'MM-DD-YYYY'))
        //         //condition = condition && !!val.RequestDate && moment(val.RequestDate).isBetween(query.current.start, query.current.end)
        //         //condition = condition && !!val.RequestDate && moment(val?.RequestDate,'MM-DD-YYYY').isBetween(moment(query.current.start,'YYYY-DD-MM'), moment(query.current.end,'YYYY-DD-MM'))
        //         condition = condition && !!val.RequestDate && moment(val?.RequestDate, "MM/DD/YYYY").isBetween(moment(selectedDateFrom, "DD-MM-YYYY"), moment(selectedDateTo, "DD-MM-YYYY"))
        //     }
        //     if (query.current.status && query.current.status === 'All') {
        //         setItems(itemsCopy)
        //     }

        //     return condition
        // }))
        
        setItems(allItems.current.filter(val => {
            let condition = true
            if (textFieldValue) {
                condition = condition && val.PARMANo === textFieldValue
            }
            if (selectedKey && selectedKey !== 'All') {
                condition = condition && val.Status === selectedKey
            }
            if (selectedKeycontry) {
                condition = condition && val.ASNCountryCode === selectedKeycontry.toUpperCase()
            }
            if (selectedDateFrom && selectedDateTo) {
                const aa = moment(val.RequestDate, 'yyyy/MM/DD').isBetween(selectedDateFrom, selectedDateTo)
                // console.log("moment",typeof(aa),aa)
                // console.log("moment(query.current.start)",typeof(query.current.start))
                // console.log("req",moment(val?.RequestDate,'MM-DD-YYYY'))
                //condition = condition && !!val.RequestDate && moment(val.RequestDate).isBetween(query.current.start, query.current.end)
                //condition = condition && !!val.RequestDate && moment(val?.RequestDate,'MM-DD-YYYY').isBetween(moment(query.current.start,'YYYY-DD-MM'), moment(query.current.end,'YYYY-DD-MM'))
                condition = condition && !!val.RequestDate && moment(val?.RequestDate, "MM/DD/YYYY").isBetween(moment(selectedDateFrom, "DD-MM-YYYY"), moment(selectedDateTo, "DD-MM-YYYY"))
            }
            if (selectedKey && selectedKey === 'All') {
                setItems(itemsCopy)
            }

            return condition
        }))
    }
    console.log(items)
    function formatDate(date: Date): string {
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString(); // getMonth() 返回 0-11
        const year = date.getFullYear().toString();

        // 确保日和月始终是两位数字
        day = day.length < 2 ? '0' + day : day;
        month = month.length < 2 ? '0' + month : month;

        return `${day}-${month}-${year}`;
    }

    function reestoption(): void {
        setSelectedKey(null);
        setSelectedKeyCountry(null);
        setTextFieldValue("")
        setSelectedDateFrom(null)
        setSelectedDateTo(null)
        setSupplierName('')
        setItems(itemsCopy)
    }

    return (
        <div className={styles.caseList}>
            <div className={styles.content}>
                <Stack horizontal>
                    <Icon style={{ fontSize: "14px", color: '#00829B' }} iconName="Back" />
                    <span style={{ marginLeft: '8px', color: '#00829B' }} ><a href={webURL + "/sitepages/CollabHome.aspx"} style={{ color: '#00829B', fontSize: "12px" }}>Return to home</a></span>
                </Stack>
                <div className={styles.title}>Case List</div>
                <Stack className={styles.contentBox} verticalAlign="center">
                    <Stack horizontal horizontalAlign="start" style={{ marginBottom: 10 }}>
                        <Label className={styles.formLabel}>Status</Label>
                        <Dropdown
                            placeholder="Select an option"
                            // label="Status"
                            options={Statusoptions}
                            styles={dropdownStyles}
                            onChange={handleStatus}
                            selectedKey={selectedKey}

                        />  {"   "}
                        <Label className={styles.formLabel}>Country </Label>
                        <Dropdown
                            placeholder="Select an option"
                            //   label="Country"
                            options={countryoption}
                            styles={dropdownStyles}
                            onChange={handleCty}
                            selectedKey={selectedKeycontry}
                        />
                    </Stack >
                    <Stack horizontal horizontalAlign="start" style={{ marginRight: 20 }}>
                        <Label className={styles.formLabel}>Parma</Label>
                        <TextField styles={textStyles} onChange={fetchName} value={textFieldValue} />{" "}
                        <Label className={styles.formLabel}>Supplier Name</Label>
                        <Label>{supplierName}</Label>
                    </Stack>
                    <Stack horizontal horizontalAlign="start" style={{ marginTop: 10, alignItems: 'center' }}>
                        <Label className={styles.formLabel}>Plan Start Date</Label>
                        <Label className={styles.formLabel}>From</Label>
                        <DatePicker
                            placeholder="Select a date..."
                            ariaLabel="Select a date"
                            styles={datePickerStyles}
                            textField={{
                                styles: datePickerTextStyles
                            }}
                            // DatePicker uses English strings by default. For localized apps, you must override this prop.
                            strings={defaultDatePickerStrings}
                            formatDate={formatDate}
                            onSelectDate={handleStart}
                            value={selectedDateFrom}
                        />
                        <Label style={{ marginLeft: 10, marginRight: 10 }}>To</Label>
                        <DatePicker
                            placeholder="Select a date..."
                            ariaLabel="Select a date"
                            styles={datePickerStyles}
                            textField={{
                                styles: datePickerTextStyles
                            }}
                            formatDate={formatDate}
                            // DatePicker uses English strings by default. For localized apps, you must override this prop.
                            strings={defaultDatePickerStrings}
                            onSelectDate={handleEnd}
                            value={selectedDateTo}
                        />
                    </Stack>
                    <Stack horizontal horizontalAlign="end" style={{ marginTop: 10 }}>
                        <Button style={{ width: 117, borderRadius: '6px' }} onClick={reestoption}>Reset</Button>
                        <Button onClick={handleSearch} style={{
                            width: 117, marginLeft: '20px', borderRadius: '6px', color: '#fff',
                            background: '#00829B'
                        }}>Search</Button>
                        {/* <PrimaryButton onClick={handleSearch} style={{marginRight:10,color:"red"}}>Search</PrimaryButton>
                        <PrimaryButton>Reset</PrimaryButton> */}
                    </Stack>
                </Stack>

                <Stack className={styles.contentBox} verticalAlign="center" style={{ marginTop: '24px' }}>
                    <DetailsList
                        items={items.slice(10 * (page - 1), 10 * (page - 1) + 9)}

                        columns={columns}
                        selectionMode={SelectionMode.none}
                        setKey="multiple"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        selectionPreservedOnEmptyClick={true}

                        enterModalSelectionOnTouch={true}

                        checkButtonAriaLabel="select row"
                        onRenderDetailsFooter={() => 
                            items.length === 0 && 
                                <Stack verticalAlign="center" style={{height: '500px', width: '100%', alignItems: 'center'}}>
                                    <span style={{fontSize: '22px', fontWeight: 600}}>No data can be displayed</span>
                                    <span style={{fontSize: '15px', marginTop: '14px'}}>Please enter valid criteria to search data</span>
                                </Stack>
                        }
                    />
                    <Stack horizontal horizontalAlign="center">
                        <Pagination size="small" showSizeChanger={false} current={page} onChange={handlePageChange} total={items.length} />
                    </Stack>
                    {/* <Stack verticalAlign="center" tokens={{ childrenGap: 10 }}>
                        <Text className="labelStyle">No data can be displayed</Text>
                        <span className="spanStyle">Please enter valid criteria to search data</span>
                    </Stack> */}
                </Stack>
            </div>
        </div>
    )





})