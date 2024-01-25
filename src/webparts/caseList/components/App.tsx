/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { memo } from "react";
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
// interface Iitem {
//     "Case ID": string,
//     "Parma": string,
//     "Supplier Name"?: string,
//     "GSDBID": string,
//     "Creation Date": string,
//     "Start Date": string,
//     "Status": string,
// }

export default memo(function App() {
    const sp = spfi(getSP());
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
            fieldName: 'Case ID',
            minWidth: 40,
            maxWidth: 80,
            styles: colomnstyle
            // onRender: (item: Iitem) => (
            //   <Text>{item.Material}</Text>
            // ),
        },
        {
            key: 'column2',
            name: 'Parma',
            ariaLabel: 'Column operations for File type, Press to sort on File type',
            isIconOnly: false,
            fieldName: 'Parma',
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
            fieldName: 'Supplier Name',
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
            fieldName: 'Creation Date',
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
            fieldName: 'Start Date',
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
            styles: colomnstyle
            // onRender: (item: Iitem) => (
            //   <Text>{item.Material}</Text>
            // ),
        }]
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
    ];

    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 170, marginRight: 40 },
    };


    const array: IDropdownOption[] = [];
    const Countryoptions: IDropdownOption[] = array
    // 变量拼起来 空格会导致搜索不到
    //const temp_Address = sp.web.lists.getByTitle("Entities").items.select("Title","Country","Address").filter(`Name eq ${(taregetID)}`).getAll();

    const itemoption = sp.web.lists.getByTitle("Country").renderListDataAsStream({
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
                array.push({ key: response.Row[i].Title, text: response.Row[i].Title })

            }
            console.log("array", array);
            console.log(itemoption);
        }
    }

    )
    //   .then((response) => {
    //     console.log("res",response)
    //     if (response.Row.length > 0) {
    //       return {
    //         Qtyonhand: response.Row[0].QtyonHand,
    //         ID: response.Row[0].ID,

    //       } as InventoryItem;
    //     } else return {} as InventoryItem;
    //   });
    //   //console.log(,"item")
    // return item;

    return (
        <>
            <Stack>
                <Label style={{ fontSize: 18 }}>NII Case List</Label>

            </Stack>

            <Stack horizontal horizontalAlign="start" style={{ marginBottom: 10 }}>
                <Label style={{ width: 60 }}>Status</Label>
                <Dropdown
                    placeholder="Select an option"
                    // label="Status"
                    options={Statusoptions}
                    styles={dropdownStyles}
                />  {"   "}
                <Label style={{ width: 60 }}>Country </Label><Dropdown
                    placeholder="Select an option"
                    //   label="Country"
                    options={Countryoptions}
                    styles={dropdownStyles}
                />
            </Stack >
            <Stack horizontal horizontalAlign="start" style={{ marginRight: 20 }}>
                <Label style={{ width: 60 }}>Parma</Label> <TextField style={{ width: 170 }} />{" "}
                <Label style={{ width: 100, marginRight: 10, marginLeft: 40 }}>Supplier Name</Label> <Label>Supplier Name should get from parma </Label>
            </Stack>
            <Stack>
                <DatePicker
                    placeholder="Select a date..."
                    ariaLabel="Select a date"
                    // DatePicker uses English strings by default. For localized apps, you must override this prop.
                    strings={defaultDatePickerStrings}
                />
            </Stack>

            <DetailsList
                items={items}

                columns={columns}
                selectionMode={SelectionMode.multiple}
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