import {
  Col,
  Row,
  Select,
  Tabs,
  Button,
  Upload,
  Radio,
  Input,
  InputNumber,
  Table,
  DatePicker,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { DatePickerProps, RadioChangeEvent } from "antd";
import * as React from "react";
import "antd/dist/antd.css";
import styles from "../CaseForm.module.scss";
import { INiiCaseItem } from "../../../../common/model/niicase";
import { IAppProps } from "../IAppProps";
import * as moment from "moment";
import { useCases } from "../../../../common/hooks/useCases";
import { IPackaging } from "../../../../common/model/packagingneed";
import Card from "antd/lib/card/Card";
import AppContext from "../../../../common/AppContext";
import { Stack } from "office-ui-fabric-react";
import DebouncedInputCommon from "./debounceinput";

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
    ,
    ,
    currentCase,
    currentCaseId,
    packagingNeeds,
    receivingPlant,
    consequenses,
    packagingData,
    contractFiles,
    originalFiles,
    countryCodes,
    userRoles,
    currentUserEmail,
    initialCaseForm,
    ,
    editCase,
    editPackagingNeed,
    addPackagingNeed,
    removePackagingNeedsById,
    uploadFile,
  ] = useCases();
  const editableStatus = [
    "Case Created",
    "In Contract Sign Off Process",
    "Contract Submitted",
  ];
  const currentUserRoles: string[] = JSON.parse(JSON.stringify(userRoles));
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
    isStatusEditable:
      (currentCase.Status === "Case Created" &&
        currentUserRoles.indexOf("PE") !== -1) ||
      (currentCase.Status === "In Contract Sign Off Process" &&
        currentUserRoles.indexOf("Pack MD Master") !== -1),
    isContractEditable:
      ["In Contract Sign Off Process", "Contract Submitted"].indexOf(
        currentCase.Status
      ) !== -1 && currentUserRoles.indexOf("Pack MD Master") !== -1,
    isApprovalAllow:
      currentCase.Status === "Contract Submitted" &&
      currentUserRoles.indexOf("GDL Team") !== -1,
    isPackagingNeedsEditable:
      editableStatus.indexOf(currentCase.Status) !== -1 ||
      currentUserRoles.indexOf("Pack MD Master") !== -1,
    userRoles: userRoles,
  };
  const yearOptions = [];
  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    yearOptions.push({
      value: i,
      label: i.toString(),
    });
  }
  const [states, setStates] = React.useState(initialState);
  const [fileList, setFileList] = React.useState([]);
  const [existFile, setexistFile] = React.useState(contractFiles.length > 0);
  const [modalDetail, setModalDetail] = React.useState({
    isShow: false,
    message: "",
    type: "",
    isDataInvalid: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [needReplace, setneedReplace] = React.useState(
    contractFiles.length > 0
  );
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
      width: "25%",
      editable: true,
    },
    {
      title: "Packaging Name",
      dataIndex: "PackagingName",
      width: "25%",
      editable: false,
    },
    {
      title: "WeeklyDemand",
      dataIndex: "WeeklyDemand",
      width: "25%",
      editable: false,
    },

    {
      title: "YearlyDemand",
      dataIndex: "YearlyDemand",
      width: "25%",
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
  const dateFormat = "DD-MM-YYYY";
  const appContext = React.useContext(AppContext);
  //#endregion
  //#region events

  const onTextChange = (
    e: string,
    field: keyof typeof states.currentCase
  ): void => {
    const currentCaseDup = { ...states.currentCase };
    (currentCaseDup[field] as string) = e;
    setStates({ ...states, currentCase: currentCaseDup });
  };
  const onApprovalChange = (e: RadioChangeEvent): void => {
    const caseTemp = JSON.parse(JSON.stringify({ ...states.currentCase }));
    caseTemp.Approval = e.target.value;
    switch (e.target.value) {
      case 1: {
        caseTemp.Status = "Case Approved";
        break;
      }
      case 0: {
        caseTemp.Status = "Case Rejected";
      }
    }
    setStates({
      ...states,
      currentCase: caseTemp,
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
    inputKey: React.Key,
    field: string
  ): void => {
    const packagingDups: IPackaging[] = JSON.parse(
      JSON.stringify([...states.packagingNeeds])
    );
    console.log(inputKey);
    console.log(packagingDups);
    packagingDups
      .filter((packagingDup) => packagingDup.key === inputKey)
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
            item.ErrorMessageNumber = "";
            item.YearlyDemand = Number(e);
            item.WeeklyDemand = Math.ceil(Number(e) / 48);
            if (Number(e) <= 0) {
              item.ErrorMessageNumber = "invalid";
            }
            break;
          }
        }
      });
    const newStates = { ...states, packagingNeeds: packagingDups };
    if (JSON.stringify(states) !== JSON.stringify(newStates)) {
      setStates(newStates);
    }
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
        Year: states.packageYear.toString(),
        MasterID: states.currentCase.ID,
        CaseID: states.currentCase.CaseID,
      });
    }
    console.log(packagingDup);
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
    caseTemp.Approval = null;
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
        addPackagingNeed({ Packaging: packaging });
      }
    });
    const removePackagingIdsDup = [...states.removePackagingIds];
    removePackagingIdsDup.forEach((id) => {
      removePackagingNeedsById(id);
    });
    if (fileList.length > 0 || needReplace) {
      const originalFileUrl =
        contractFiles.length > 0 ? contractFiles[0].ServerRelativeUrl : "";
      uploadFile(fileList, needReplace, originalFileUrl, currentCaseId);
    }
    await editCase({ niiCase: caseUpdate });
    initialCaseForm(Number(currentCaseId), currentUserEmail);
  };
  const onOpenModal = (type: string): void => {
    switch (type) {
      case "removeFile": {
        setModalDetail({
          isShow: true,
          message: "Are you sure to delete the current contract?",
          type: type,
          isDataInvalid: false,
        });
        break;
      }
      case "removePackagings": {
        setModalDetail({
          isShow: true,
          message: "Are you sure to remove these packagings?",
          type: type,
          isDataInvalid: false,
        });
        break;
      }
      case "cancel": {
        setModalDetail({
          isShow: true,
          message: "Are you sure to leave?",
          type: type,
          isDataInvalid: false,
        });
        break;
      }
      case "save": {
        const packagingNeedsDup = [...states.packagingNeeds];
        if (
          states.currentCase.Status === "Contract Submitted" &&
          fileList.length === 0 &&
          !existFile
        ) {
          setModalDetail({
            isShow: true,
            message: "Please upload contract before saving",
            type: "invalid",
            isDataInvalid: true,
          });
          break;
        }
        if (
          packagingNeedsDup.filter((i) => !!i.ErrorMessage).length > 0 ||
          packagingNeedsDup.filter((i) => i.YearlyDemand === undefined).length >
            0 ||
          packagingNeedsDup.filter((i) => i.YearlyDemand === null).length > 0 ||
          packagingNeedsDup.filter((i) => i.YearlyDemand <= 0).length > 0
        ) {
          setModalDetail({
            isShow: true,
            message: "Please correct invalid data before saving",
            type: "invalid",
            isDataInvalid: true,
          });
          break;
        }
        setModalDetail({
          isShow: true,
          message: "Are you sure to save the data?",
          type: type,
          isDataInvalid: false,
        });
        break;
      }
    }
  };
  const onConfirm = async (type: string): Promise<void> => {
    switch (type) {
      case "removeFile": {
        setexistFile(false);
        break;
      }
      case "removePackagings": {
        onDelete();
        break;
      }
      case "cancel": {
        window.location.href = `${appContext.context.pageContext.web.absoluteUrl}/SitePages/CaseList.aspx`;
        break;
      }
      case "save": {
        await onSave();
        break;
      }
    }
    setModalDetail({
      isShow: false,
      message: "",
      type: "",
      isDataInvalid: false,
    });
  };
  //#endregion
  //#region methods
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const cellInput = (field: string, record: IPackaging) => {
    switch (field) {
      case "Packaging":
        return (
          <>
            <Row>
              <DebouncedInputCommon
                onPackagingChange={onPackagingChange}
                defaultValue={record.Packaging}
                inputKey={record.key}
                field="Packaging"
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
          <>
            <InputNumber
              controls={false}
              value={record.YearlyDemand}
              readOnly={
                !states.packageEditable || !states.isPackagingNeedsEditable
              }
              onBlur={(e) =>
                onPackagingChange(e.target.value, record.key, "YearlyDemand")
              }
              bordered={
                states.packageEditable && states.isPackagingNeedsEditable
              }
              min={1}
              precision={0}
            />
            {!!record.ErrorMessageNumber && (
              <Row>
                <Input
                  className={styles.inputAlert}
                  defaultValue={record.ErrorMessageNumber}
                  readOnly={true}
                  bordered={false}
                />
              </Row>
            )}
          </>
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
          <div>{cellInput(dataIndex, record)}</div>
        ) : (
          children
        )}
      </td>
    );
  };
  //#endregion
  return (
    <div>
      <Row className={styles.title}>
        <Col>Case Handling</Col>
      </Row>
      <Row className={styles.rowContent}>
        <Col span={24}>
          <Card bordered={false}>
            <Row align="middle">
              <Col span={5}>Case ID:</Col>
              <Col span={6}>{states.currentCase.CaseID}</Col>
              <Col offset={1} span={5}>
                Status:
              </Col>
              <Col span={7}>
                {states.isStatusEditable && (
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
                )}
                {!states.isStatusEditable && (
                  <span>{states.currentCase.Status}</span>
                )}
              </Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Col span={5}>Created By:</Col>
              <Col span={6}>{states.currentCase.Author}</Col>
              <Col offset={1} span={5}>
                Sign-off Contract:
              </Col>
              <Col span={7}>
                {!existFile && (
                  <Upload
                    fileList={fileList}
                    beforeUpload={(file) => {
                      setFileList([file]);
                      setexistFile(false);
                      return false;
                    }}
                    onRemove={(file) => {
                      setFileList(
                        fileList.filter((item) => item.uid !== file.uid)
                      );
                    }}
                  >
                    {fileList.length === 0 && (
                      <Button
                        icon={<UploadOutlined rev={undefined} />}
                        style={{
                          borderRadius: "6px",
                        }}
                        disabled={!states.isContractEditable}
                      >
                        Click to Upload
                      </Button>
                    )}
                  </Upload>
                )}
                {existFile && (
                  <Row align="middle">
                    <Col span={20}>
                      <a
                        href={contractFiles[0].ServerRelativeUrl}
                        style={{ color: "#00829B" }}
                      >
                        {contractFiles[0].Name}
                      </a>
                    </Col>
                    <Col span={4}>
                      {states.isContractEditable && (
                        <Button
                          onClick={() => onOpenModal("removeFile")}
                          style={{
                            borderRadius: "6px",
                          }}
                        >
                          <DeleteOutlined rev={undefined} />
                        </Button>
                      )}
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Col span={5}>Creation Date:</Col>
              <Col span={6}>{states.currentCase.Created}</Col>
              <Col offset={1} span={5}>
                Approval:
              </Col>
              <Col span={7}>
                <Radio.Group
                  disabled={!states.isApprovalAllow}
                  onChange={onApprovalChange}
                  value={states.currentCase.Approval}
                >
                  <Radio value={1}>Approve</Radio>
                  <Radio value={0}>Reject</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Col span={5}>Original Request Form:</Col>
              <Col>
                {originalFiles.length > 0 && (
                  <a
                    href={originalFiles[0].ServerRelativeUrl}
                    style={{ color: "#00829B" }}
                  >
                    {originalFiles[0].Name}
                  </a>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row className={styles.sectionTwo}>
        <Col span={24}>
          <Card bordered={false}>
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
                        onTextChange(e.target.value, "PARMANo");
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
                        onTextChange(e.target.value, "CompanyName");
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.marginTop} align="middle">
                  <Col className={styles.fontBold}>
                    Address(administrative):
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>Street/P.O. Box:</Col>
                  <Col span={8}>
                    <Input
                      className={styles.inputStyle}
                      defaultValue={states.currentCase.ASNStreet}
                      disabled={!states.isEditableCommon}
                      onChange={(e) => {
                        onTextChange(e.target.value, "ASNStreet");
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
                        onTextChange(e.target.value, "ASNPostCode");
                      }}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>Country Code:</Col>
                  <Col span={8}>
                    {states.isEditableCommon && (
                      <Select
                        className={styles.selectWrapper}
                        defaultValue={states.currentCase.ASNCountryCode}
                        onChange={(e) => {
                          onTextChange(e, "ASNCountryCode");
                        }}
                        options={countryCodes}
                      />
                    )}
                    {!states.isEditableCommon && (
                      <Input
                        className={styles.inputStyle}
                        defaultValue={states.currentCase.ASNCountryCode}
                        disabled={true}
                      />
                    )}
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
                        onTextChange(e.target.value, "ASNPhone");
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
                        onTextChange(e.target.value, "BilltoNo");
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
                        onTextChange(e.target.value, "BillStreet");
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
                        onTextChange(e.target.value, "BillPostCode");
                      }}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>Country Code:</Col>
                  <Col span={8}>
                    {states.isEditableCommon && (
                      <Select
                        className={styles.selectWrapper}
                        defaultValue={states.currentCase.BillCountryCode}
                        onChange={(e) => {
                          onTextChange(e, "BillCountryCode");
                        }}
                        options={countryCodes}
                      />
                    )}
                    {!states.isEditableCommon && (
                      <Input
                        className={styles.inputStyle}
                        defaultValue={states.currentCase.BillCountryCode}
                        disabled={true}
                      />
                    )}
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
                        onTextChange(e.target.value, "BillPhone");
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
                        onTextChange(e.target.value, "ShipToNo");
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
                        onTextChange(e.target.value, "ShipStreet");
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
                        onTextChange(e.target.value, "ShipPostcode");
                      }}
                    />
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>Country Code:</Col>
                  <Col span={8}>
                    {states.isEditableCommon && (
                      <Select
                        className={styles.selectWrapper}
                        defaultValue={states.currentCase.ShipCountryCode}
                        onChange={(e) => {
                          onTextChange(e, "ShipCountryCode");
                        }}
                        options={countryCodes}
                      />
                    )}
                    {!states.isEditableCommon && (
                      <Input
                        className={styles.inputStyle}
                        defaultValue={states.currentCase.ShipCountryCode}
                        disabled={true}
                      />
                    )}
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
                        onTextChange(e.target.value, "ShipPhone");
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
                        onTextChange(e.target.value, "VatNo");
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
                        onTextChange(e.target.value, "GSDBID");
                      }}
                    />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Packaging Contact" key="2">
                <Row className={styles.marginTop}>
                  <Col className={styles.fontBold}>
                    Packaging Contact Person:
                  </Col>
                </Row>
                <Row align="middle">
                  <Col span={6}>First and Last Name:</Col>
                  <Col span={8}>
                    <Input
                      className={styles.inputStyle}
                      defaultValue={states.currentCase.ContractName}
                      disabled={!states.isEditableCommon}
                      onChange={(e) => {
                        onTextChange(e.target.value, "ContractName");
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
                        onTextChange(e.target.value, "ContractEmail");
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
                        onTextChange(e.target.value, "ContractPhoneno");
                      }}
                    />
                  </Col>
                </Row>
                <Row className={styles.marginTop}>
                  <Col className={styles.fontBold}>
                    Receiving PLANT/RECEIVER:
                  </Col>
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
                      <Radio value={"Yes"}>Yes</Radio>
                      <Radio value={"No"}>No</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                <div
                  style={{
                    visibility:
                      states.currentCase.Constatus === "Yes"
                        ? "visible"
                        : "hidden",
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
                          onTextChange(e.target.value, "ConPackagingAccno");
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
                          onTextChange(e.target.value, "ConCompanyName");
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
                          onTextChange(e.target.value, "ConCity");
                        }}
                      />
                    </Col>
                  </Row>
                  <Row align="middle">
                    <Col span={6}>Country Code:</Col>
                    <Col span={8}>
                      {states.isEditableCommon && (
                        <Select
                          className={styles.selectWrapper}
                          defaultValue={states.currentCase.ConCountryCode}
                          onChange={(e) => {
                            onTextChange(e, "ConCountryCode");
                          }}
                          options={countryCodes}
                        />
                      )}
                      {!states.isEditableCommon && (
                        <Input
                          className={styles.inputStyle}
                          defaultValue={states.currentCase.ConCountryCode}
                          disabled={true}
                        />
                      )}
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
                    Yearly calculated need in number of transactions per
                    packaging type
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
                      options={yearOptions}
                    />
                  </Col>
                  <Col span={4} offset={2}>
                    <Button
                      style={{
                        borderRadius: "6px",
                      }}
                      className={styles.iconPlus}
                      icon={<PlusOutlined rev={undefined} />}
                      onClick={onAdd}
                      disabled={
                        !states.packageEditable ||
                        !states.isPackagingNeedsEditable
                      }
                    />
                    <Button
                      style={{
                        borderRadius: "6px",
                      }}
                      className={styles.iconDelete}
                      icon={<DeleteOutlined rev={undefined} />}
                      onClick={() => onOpenModal("removePackagings")}
                      disabled={
                        !states.packageEditable ||
                        !states.isPackagingNeedsEditable
                      }
                    />
                  </Col>
                </Row>
                <Row className={styles.rowContent}>
                  <Col span={22}>
                    <Table
                      pagination={false}
                      rowSelection={rowSelection}
                      components={{ body: { cell: EditableCell } }}
                      dataSource={states.packagingNeeds.filter(
                        (i) => i.Year === states.packageYear.toString()
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
                        onTextChange(e.target.value, "IssuCompName");
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
                        onTextChange(e.target.value, "IssuName");
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
                        onTextChange(e.target.value, "IssuPhoneNo");
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
                        onTextChange(e.target.value, "IssuEmail");
                      }}
                    />
                  </Col>
                </Row>
              </Tabs.TabPane>
            </Tabs>
            <Row className={styles.rowContent}>
              <Col offset={15} span={4}>
                <Button
                  style={{
                    borderRadius: "6px",
                  }}
                  className={styles.fixedWidth}
                  onClick={() => onOpenModal("cancel")}
                >
                  Cancel
                </Button>
              </Col>
              <Col offset={1} span={4}>
                <Button
                  style={{
                    borderRadius: "6px",
                    color: "#fff",
                    background: "#00829B",
                  }}
                  className={styles.fixedWidth}
                  onClick={() => onOpenModal("save")}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {/** modals */}
      <Modal
        open={modalDetail.isShow}
        closable={false}
        footer={null}
        width={500}
        style={{ borderRadius: "6px", overflow: "hidden", paddingBottom: 0 }}
      >
        <Stack
          verticalAlign="center"
          style={{
            alignItems: "center",
            paddingTop: "64px",
            paddingBottom: "54px",
          }}
        >
          <p>{modalDetail.message}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {!modalDetail.isDataInvalid && (
              <>
                <Button
                  onClick={() =>
                    setModalDetail({
                      isShow: false,
                      message: "",
                      type: "",
                      isDataInvalid: false,
                    })
                  }
                  style={{
                    width: 120,
                    height: 42,
                    marginTop: "32px",
                    borderRadius: "6px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  style={{
                    width: 120,
                    height: 42,
                    marginTop: "32px",
                    borderRadius: "6px",
                    color: "#fff",
                    background: "#00829B",
                  }}
                  onClick={async () => {
                    await onConfirm(modalDetail.type);
                  }}
                >
                  Yes
                </Button>
              </>
            )}
            {modalDetail.isDataInvalid && (
              <>
                <Button
                  onClick={() =>
                    setModalDetail({
                      isShow: false,
                      message: "",
                      type: "",
                      isDataInvalid: false,
                    })
                  }
                  style={{
                    width: 120,
                    height: 42,
                    marginTop: "32px",
                    borderRadius: "6px",
                    color: "#fff",
                    background: "#00829B",
                  }}
                >
                  Ok
                </Button>
              </>
            )}
          </div>
        </Stack>
      </Modal>
    </div>
  );
};

export default CaseFormView;
