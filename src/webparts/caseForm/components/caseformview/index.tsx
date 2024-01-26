/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Col,
  Row,
  Select,
  Tabs,
  Button,
  Upload,
  Radio,
  Divider,
  Input,
  InputNumber,
  Table,
  DatePicker,
  message,
  Alert,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { DatePickerProps, RadioChangeEvent, UploadProps } from "antd";
import * as React from "react";
import "antd/dist/antd.css";
import styles from "../CaseForm.module.scss";
import { INiiCaseItem } from "../../../../common/model/niicase";
import { IAppProps } from "../IAppProps";
import * as moment from "moment";
import { useCases } from "../../../../common/hooks/useCases";
import { IPackaging } from "../../../../common/model/packagingneed";
import DebouncedInput from "./debounceinput";

const CaseFormView: React.FC = () => {
  //#region interfaces
  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    index: React.Key;
    title: string;
    record: IPackaging;
    children: React.ReactNode;
  }
  //#endregion
  //#region fields
  const [
    isFetching,
    errorMessage,
    currentCase,
    currentCaseId,
    packagingNeeds,
    receivingPlant,
    consequenses,
    packagingData,
    changeCaseId,
    fetchCaseById,
    editCase,
    fetchConsequensesByCase,
    fetchPackagingNeedsByCase,
    editPackagingNeed,
    addPackagingNeed,
    removePackagingNeedsById,
    fetchReceivingPlantByCase,
    fetchPackagingData,
  ] = useCases();
  const editableStatus = [
    "Case Created",
    "In Contract Sign Off Process",
    "Contract Submitted",
  ];
  const initialState: IAppProps = {
    currentCase: currentCase,
    packagingNeeds: packagingNeeds,
    receivingPlant: receivingPlant,
    consequenses: consequenses,
    packageYear: new Date().getFullYear(),
    packageEditable: true,
    selectedPackages: [],
    removePackagingIds: [],
    isEditableCommon: editableStatus.indexOf(currentCase.Status) !== -1,
  };
  const [states, setStates] = React.useState(initialState);
  const receivingColumns = [
    {
      title: "Packaging account no.",
      dataIndex: "PackagingAccountNo",
      width: "28%",
    },
    {
      title: "Company name",
      dataIndex: "CompanyName",
      width: "28%",
    },
    {
      title: "City",
      dataIndex: "City",
      width: "16%",
    },
    {
      title: "Country Code",
      dataIndex: "CountryCode",
      width: "28%",
    },
  ];
  const consequenseColumns = [
    {
      title: "Packaging",
      dataIndex: "Packaging",
      width: "33%",
    },
    {
      title: "Packaging Name",
      dataIndex: "PackagingName",
      width: "33%",
    },
    {
      title: "No.(QTY) Yearly Need",
      dataIndex: "Demand",
      width: "34%",
    },
  ];
  const packagingColumnBase = [
    {
      title: "Packaging",
      dataIndex: "Packaging",
      width: "15%",
      editable: false,
    },
    {
      title: "No.(Qty)",
      dataIndex: "WeeklyDemand",
      width: "30%",
      editable: false,
    },
    {
      title: "Packaging",
      dataIndex: "Packaging",
      width: "15%",
      editable: true,
    },
    {
      title: "Packaging Name",
      dataIndex: "PackagingName",
      width: "25%",
      editable: false,
    },
    {
      title: "No.(Qty)",
      dataIndex: "YearlyDemand",
      width: "15%",
      editable: true,
    },
  ];
  const packagingColumns = packagingColumnBase.map((col) => {
    return {
      ...col,
      onCell: (record: IPackaging) => ({
        record,
        title: col.title,
        dataIndex: col.dataIndex,
        editing: states.currentCase.Status === "Case Created" && col.editable,
      }),
    };
  });
  const rowSelection = {
    hideSelectAll: true,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IPackaging[]) => {
      setStates({ ...states, selectedPackages: selectedRows });
    },
  };
  const props: UploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log("done");
      } else if (info.file.status === "error") {
        console.log("error");
      }
    },
  };
  const dateFormat = "DD-MM-YYYY";
  //#endregion
  //#region events
  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof states.currentCase
  ): void => {
    const currentCaseDup = { ...states.currentCase };
    (currentCaseDup[field] as string) = e.target.value;
    setStates({ ...states, currentCase: currentCaseDup });
  };
  const onApprovalChange = (e: RadioChangeEvent): void => {
    setStates({
      ...states,
      currentCase: { ...states.currentCase, Approval: e.target.value },
    });
  };
  const onConsequenseChange = (e: RadioChangeEvent): void => {
    setStates({
      ...states,
      currentCase: { ...states.currentCase, Constatus: e.target.value },
    });
  };
  const onPackagingChange = (
    e: number | string,
    key: React.Key,
    field: string
  ): void => {
    console.log(e);
    console.log(key);
    console.log(field);
    const packagingDups: IPackaging[] = JSON.parse(
      JSON.stringify([...states.packagingNeeds])
    );
    packagingDups
      .filter((packagingDup) => packagingDup.key === key)
      .forEach((item) => {
        switch (field) {
          case "Packaging": {
            item.Packaging = e.toString();
            const packagingDataFiltered = packagingData.filter(
              (i) => i.ItemNumber === e.toString()
            );
            if (packagingDataFiltered.length > 0) {
              item.PackagingName = packagingDataFiltered[0].Description;
              item.ErrorMessage = "";
            } else {
              item.PackagingName = "";
              item.ErrorMessage = "Invalid";
            }
            if (
              packagingDups.filter(
                (i) => i.Packaging === e.toString() && i.Year === item.Year
              ).length > 1
            ) {
              item.ErrorMessage = "Duplicate";
            }
            break;
          }
          case "YearlyDemand": {
            item.YearlyDemand = Number(e);
            item.WeeklyDemand = Math.ceil(Number(e) / 48);
            break;
          }
        }
      });
    setStates({ ...states, packagingNeeds: packagingDups });
  };
  const onAdd = (): void => {
    const packagingDup = [...states.packagingNeeds];
    if (packagingDup.length > 0) {
      packagingDup.push({
        key: Number(packagingDup[packagingDup.length - 1].key) + 1,
        Year: states.packageYear.toString(),
        MasterID: states.currentCase.ID,
        CaseID: states.currentCase.CaseID,
      });
    } else {
      packagingDup.push({
        key: 0,
      });
    }
    setStates({ ...states, packagingNeeds: packagingDup });
  };
  const onDelete = (): void => {
    const packagesDup = [...states.packagingNeeds];
    const removePackagingIdsDup = [...states.removePackagingIds];
    states.selectedPackages.forEach((selectedPackage) => {
      packagesDup.splice(packagesDup.indexOf(selectedPackage), 1);
      if (!!selectedPackage.ID) {
        removePackagingIdsDup.push(Number(selectedPackage.ID));
      }
    });
    setStates({
      ...states,
      packagingNeeds: packagesDup,
      removePackagingIds: removePackagingIdsDup,
    });
  };
  const onStatusChange = (statusValue: string): void => {
    const caseTemp = JSON.parse(JSON.stringify({ ...states.currentCase }));
    caseTemp.Status = statusValue;
    setStates({ ...states, currentCase: caseTemp });
  };
  const onPackageYearChange = (year: number): void => {
    setStates({
      ...states,
      packageYear: year,
      packageEditable: year === new Date().getFullYear(),
    });
  };
  const onRequestDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setStates({
      ...states,
      currentCase: {
        ...states.currentCase,
        RequestDate: dateString,
      },
    });
  };
  const onSave = async (): Promise<void> => {
    const currentCaseDup = { ...states.currentCase };
    const caseUpdate: INiiCaseItem = {
      ID: currentCaseDup.ID,
      Title: currentCaseDup.Title,
      CaseID: currentCaseDup.CaseID,
      PARMANo: currentCaseDup.PARMANo,
      CompanyName: currentCaseDup.CompanyName,
      Status: currentCaseDup.Status,
      ASNStreet: currentCaseDup.ASNStreet,
      ASNPostCode: currentCaseDup.ASNPostCode,
      ASNCountryCode: currentCaseDup.ASNCountryCode,
      ASNPhone: currentCaseDup.ASNPhone,
      BilltoNo: currentCaseDup.BilltoNo,
      BillStreet: currentCaseDup.BillStreet,
      BillPostCode: currentCaseDup.BillPostCode,
      BillCountryCode: currentCaseDup.BillCountryCode,
      BillPhone: currentCaseDup.BillPhone,
      ShipToNo: currentCaseDup.ShipToNo,
      ShipStreet: currentCaseDup.ShipStreet,
      ShipPostcode: currentCaseDup.ShipPostcode,
      ShipCountryCode: currentCaseDup.ShipCountryCode,
      ShipPhone: currentCaseDup.ShipPhone,
      VatNo: currentCaseDup.VatNo,
      GSDBID: currentCaseDup.GSDBID,
      ContractName: currentCaseDup.ContractName,
      ContractEmail: currentCaseDup.ContractEmail,
      ContractPhoneno: currentCaseDup.ContractPhoneno,
      Constatus: currentCaseDup.Constatus,
      ConPackagingAccno: currentCaseDup.ConPackagingAccno,
      ConCompanyName: currentCaseDup.ConCompanyName,
      ConCity: currentCaseDup.ConCity,
      ConCountryCode: currentCaseDup.ConCountryCode,
      RequestDate: moment(currentCaseDup.RequestDate, dateFormat).toDate(),
      IssuCompName: currentCaseDup.IssuCompName,
      IssuName: currentCaseDup.IssuName,
      IssuPhoneNo: currentCaseDup.IssuPhoneNo,
      IssuEmail: currentCaseDup.IssuEmail,
    };
    const packagingNeedsDup = [...states.packagingNeeds];
    if (packagingNeedsDup.filter((i) => !!i.ErrorMessage).length > 0) {
      await message.error("Invalid Packaging included in Packaging Needs");
      return;
    }
    const packagingNeedsUpdate = packagingNeedsDup.map((item) => {
      return {
        ID: item.ID,
        MasterID: states.currentCase.ID,
        CaseID: states.currentCase.CaseID,
        Year: item.Year,
        Packaging: item.Packaging,
        PackagingName: item.PackagingName,
        WeeklyDemand: item.WeeklyDemand,
        YearlyDemand: item.YearlyDemand,
        SupplierNo: states.currentCase.PARMANo,
        SupplierName: states.currentCase.ConCompanyName,
      } as IPackaging;
    });
    packagingNeedsUpdate.forEach((packaging) => {
      if (!!packaging.ID) {
        editPackagingNeed({ Packaging: packaging });
      } else {
        console.log(packaging);
        addPackagingNeed({ Packaging: packaging });
      }
    });
    const removePackagingIdsDup = [...states.removePackagingIds];
    removePackagingIdsDup.forEach((id) => {
      removePackagingNeedsById(id);
    });
    await editCase({ niiCase: caseUpdate });
  };
  const onCancel = (): void => {
    console.log(packagingData);
  };
  //#endregion
  //#region methods
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const cellInput = (field: string, record: IPackaging, editable: boolean) => {
    const fieldEditable = !(editable && states.packageEditable);
    switch (field) {
      case "Packaging":
        return (
          <>
            <Row>
              <DebouncedInput
                value={record.Packaging}
                readOnly={fieldEditable}
                onBlur={(e) => onPackagingChange(e, record.key, "Packaging")}
                bordered={!fieldEditable}
              />
            </Row>
            {!!record.ErrorMessage && (
              <Row>
                <Input
                  className={styles.inputAlert}
                  defaultValue={record.ErrorMessage}
                  readOnly={true}
                  bordered={false}
                />
              </Row>
            )}
          </>
        );
      case "WeeklyDemand":
        return (
          <InputNumber
            value={record.WeeklyDemand}
            readOnly={true}
            bordered={false}
          />
        );
      case "YearlyDemand":
        return (
          <InputNumber
            controls={false}
            value={record.YearlyDemand}
            readOnly={fieldEditable}
            onBlur={(e) =>
              onPackagingChange(e.target.value, record.key, "YearlyDemand")
            }
            bordered={!fieldEditable}
          />
        );
    }
  };
  const fields = ["Packaging", "WeeklyDemand", "YearlyDemand"];
  //#endregion
  //#region components
  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    index,
    title,
    record,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {fields.indexOf(dataIndex) !== -1 ? (
          <div>{cellInput(dataIndex, record, editing)}</div>
        ) : (
          children
        )}
      </td>
    );
  };
  //#endregion
  return (
    <div className={styles.listWrapper}>
      <div>
        <Row className={styles.title}>
          <Col>Nii Case Handling</Col>
        </Row>
        <Row className={styles.rowContent}>
          <Col span={6}>Case ID:</Col>
          <Col>{states.currentCase.CaseID}</Col>
        </Row>
        <Row className={styles.rowContent}>
          <Col span={6}>Created By:</Col>
          <Col>{states.currentCase.Author}</Col>
        </Row>
        <Row className={styles.rowContent}>
          <Col span={6}>Creation Date:</Col>
          <Col>{states.currentCase.Created}</Col>
        </Row>
        <Row className={styles.rowContent} align="middle">
          <Col span={6}>Status</Col>
          <Col span={8}>
            <Select
              onChange={onStatusChange}
              defaultValue={states.currentCase.Status}
              className={styles.fixedWidth}
              options={[
                {
                  value: "Case Created",
                  label: "Case Created",
                },
                {
                  value: "In Contract Sign Off Process",
                  label: "In Contract Sign Off Process",
                },
                {
                  value: "Contract Submitted",
                  label: "Contract Submitted",
                },
                {
                  value: "Case Approved",
                  label: "Case Approved",
                  disabled: true,
                },
                {
                  value: "Case Rejected",
                  label: "Case Rejected",
                  disabled: true,
                },
              ]}
            />
          </Col>
        </Row>
        <Row className={styles.rowContent} align="middle">
          <Col span={6}>Sign-off Contract:</Col>
          <Col span={10}>
            <Upload {...props}>
              <Button icon={<UploadOutlined rev={undefined} />}>
                Click to Upload
              </Button>
            </Upload>
          </Col>
        </Row>
        <Row className={styles.rowContent}>
          <Col span={6}>Approval:</Col>
          <Col span={10}>
            <Radio.Group
              onChange={onApprovalChange}
              value={states.currentCase.Approval}
            >
              <Radio value={1}>Approve</Radio>
              <Radio value={0}>Reject</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row className={styles.rowContent}>
          <Col span={3}>
            <Button className={styles.fixedWidth} onClick={onSave}>
              Save
            </Button>
          </Col>
          <Col span={3} offset={2}>
            <Button className={styles.fixedWidth} onClick={onCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
      <Divider />
      <Row className={styles.rowContent}>
        <Col span={24}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Supplier Information" key="1">
              <Row className={styles.marginTop} align="middle">
                <Col span={6}>Supplier Parma Code:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.PARMANo}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "PARMANo");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Company Name:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.CompanyName}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "CompanyName");
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop} align="middle">
                <Col className={styles.fontBold}>Address(administrative):</Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Street/P.O. Box:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ASNStreet}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ASNStreet");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Postal Code and City:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ASNPostCode}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ASNPostCode");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Country Code:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ASNCountryCode}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ASNCountryCode");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Phone No:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ASNPhone}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ASNPhone");
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop} align="middle">
                <Col className={styles.fontBold}>
                  Invoice address(if other than above):
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Supplier Parma Code:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.BilltoNo}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "BilltoNo");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Street/P.O. Box:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.BillStreet}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "BillStreet");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Postal Code and City:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.BillPostCode}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "BillPostCode");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Country Code:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.BillCountryCode}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "BillCountryCode");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Phone No:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.BillPhone}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "BillPhone");
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop} align="middle">
                <Col className={styles.fontBold}>
                  Delivery address(empty packaging):
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Supplier Parma Code:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ShipToNo}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ShipToNo");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Street/P.O. Box:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ShipStreet}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ShipStreet");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Postal Code and City:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ShipPostcode}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ShipPostcode");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Country Code:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ShipCountryCode}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ShipCountryCode");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Phone No:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ShipPhone}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ShipPhone");
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop} align="middle">
                <Col span={6}>VAT No:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.VatNo}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "VatNo");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>GSDB ID:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.GSDBID}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "GSDBID");
                    }}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Packaging Contact" key="2">
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>Packaging Contact Person:</Col>
              </Row>
              <Row align="middle">
                <Col span={6}>First and Last Name:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ContractName}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ContractName");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Email:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ContractEmail}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ContractEmail");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Phone No:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.ContractPhoneno}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "ContractPhoneno");
                    }}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>Receiving PLANT/RECEIVER:</Col>
              </Row>
              <Row>
                <Col span={22}>
                  <Table
                    pagination={false}
                    dataSource={states.receivingPlant}
                    columns={receivingColumns}
                    size="small"
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Consequences for other supplier" key="3">
              <Row className={styles.marginTop}>
                <Col span={6}>Consequenses:</Col>
                <Col span={8}>
                  <Radio.Group
                    disabled={true}
                    onChange={onConsequenseChange}
                    value={states.currentCase.Constatus}
                  >
                    <Radio value={"Y"}>Yes</Radio>
                    <Radio value={"N"}>No</Radio>
                  </Radio.Group>
                </Col>
              </Row>
              <div
                style={{
                  visibility:
                    states.currentCase.Constatus === "Y" ? "visible" : "hidden",
                }}
              >
                <Row align="middle" className={styles.marginTop}>
                  <Col span={6}>Packaging account no:</Col>
                  <Col span={8}>
                    <Input
                      className={styles.inputStyle}
                      defaultValue={states.currentCase.ConPackagingAccno}
                      disabled={!states.isEditableCommon}
                      onChange={(e) => {
                        onTextChange(e, "ConPackagingAccno");
                      }}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>Company Name:</Col>
                  <Col span={8}>
                    <Input
                      className={styles.inputStyle}
                      defaultValue={states.currentCase.ConCompanyName}
                      disabled={!states.isEditableCommon}
                      onChange={(e) => {
                        onTextChange(e, "ConCompanyName");
                      }}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>City:</Col>
                  <Col span={8}>
                    <Input
                      className={styles.inputStyle}
                      defaultValue={states.currentCase.ConCity}
                      disabled={!states.isEditableCommon}
                      onChange={(e) => {
                        onTextChange(e, "ConCity");
                      }}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>Country Code:</Col>
                  <Col span={8}>
                    <Input
                      className={styles.inputStyle}
                      defaultValue={states.currentCase.ConCountryCode}
                      disabled={!states.isEditableCommon}
                      onChange={(e) => {
                        onTextChange(e, "ConCountryCode");
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.marginTop}>
                  <Col span={15}>
                    <Table
                      pagination={false}
                      dataSource={states.consequenses}
                      columns={consequenseColumns}
                      size="small"
                    />
                  </Col>
                </Row>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Packaging Need" key="4">
              <Row className={styles.marginTop}>
                <Col>
                  Yearly calculated need in number of transactions per packaging
                  type
                </Col>
              </Row>
              <Row align="middle" className={styles.marginTop}>
                <Col span={12} className={styles.fontBold}>
                  Regular Packaging need:
                </Col>
                <Col span={2} className={styles.fontBold}>
                  Year:
                </Col>
                <Col span={3}>
                  <Select
                    defaultValue={states.packageYear}
                    className={styles.fixedWidth}
                    onChange={onPackageYearChange}
                    options={[
                      {
                        value: 2020,
                        label: "2020",
                      },
                      {
                        value: 2021,
                        label: "2021",
                      },
                      {
                        value: 2022,
                        label: "2022",
                      },
                      {
                        value: 2023,
                        label: "2023",
                      },
                      {
                        value: 2024,
                        label: "2024",
                      },
                      {
                        value: 2025,
                        label: "2025",
                      },
                      {
                        value: 2026,
                        label: "2026",
                      },
                    ]}
                  />
                </Col>
                <Col span={4} offset={2}>
                  <Button
                    shape="circle"
                    className={styles.iconPlus}
                    icon={<PlusOutlined rev={undefined} />}
                    onClick={onAdd}
                    disabled={
                      !states.packageEditable || !states.isEditableCommon
                    }
                  />
                  <Button
                    shape="circle"
                    className={styles.iconDelete}
                    icon={<DeleteOutlined rev={undefined} />}
                    onClick={onDelete}
                    disabled={
                      !states.packageEditable || !states.isEditableCommon
                    }
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col span={9} className={styles.fontBold}>
                  Weekly need:
                </Col>
                <Col className={styles.fontBold}>Yearly need:</Col>
              </Row>
              <Row>
                <Col span={22}>
                  <Table
                    pagination={false}
                    rowSelection={rowSelection}
                    components={{ body: { cell: EditableCell } }}
                    dataSource={states.packagingNeeds.filter(
                      (i) => i.Year.toString() === states.packageYear.toString()
                    )}
                    columns={packagingColumns}
                    bordered={false}
                    size="small"
                  />
                </Col>
              </Row>
              <Row align="middle" className={styles.marginTop}>
                <Col span={6}>Requested start date:</Col>
                <Col span={8}>
                  <DatePicker
                    defaultValue={moment(
                      states.currentCase.RequestDate,
                      dateFormat
                    )}
                    format={dateFormat}
                    onChange={onRequestDateChange}
                    allowClear={false}
                    disabled={!states.isEditableCommon}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Issuer Information" key="5">
              <Row className={styles.marginTop} align="middle">
                <Col className={styles.fontBold}>ISSUER:</Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Company:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.IssuCompName}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "IssuCompName");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>First and Last Name:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.IssuName}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "IssuName");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>Phone No:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.IssuPhoneNo}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "IssuPhoneNo");
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>E-mail:</Col>
                <Col span={8}>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={states.currentCase.IssuEmail}
                    disabled={!states.isEditableCommon}
                    onChange={(e) => {
                      onTextChange(e, "IssuEmail");
                    }}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default CaseFormView;
