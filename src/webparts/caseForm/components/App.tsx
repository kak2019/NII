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
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { DatePickerProps, RadioChangeEvent, UploadProps } from "antd";
import * as React from "react";
import "antd/dist/antd.css";
import styles from "./CaseForm.module.scss";
import { INiiCaseItem } from "../../../common/model/niicase";
import { IPackagingNeed } from "../../../common/model/packagingneed";
import { IAppProps } from "./IAppProps";
import { IReceiverPlant } from "../../../common/model/receiverplant";
import { IConsequense } from "../../../common/model/consequense";
import * as moment from "moment";

const App: React.FC = () => {
  //#region interfaces
  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    index: React.Key;
    title: string;
    record: IPackagingNeed;
    children: React.ReactNode;
  }
  //#endregion
  //#region fields
  const dummyCase: INiiCaseItem = {
    ID: "1",
    Creator: "Rodger",
    CaseID: "24001",
    Created: "1/16/2024",
    Status: "Case Created",
    Approval: 1,
    CompanyName: "FOMECO NV",
    ASNStreet: "Blockellestreet 121",
    ASNPostCode: "8550 Zwevegem",
    ASNCountryCode: "BELGIUM",
    BillStreet: "Blockellestreet 121",
    BillPostCode: "8550 Zwevegem",
    BillCountryCode: "BELGIUM",
    ShipStreet: "Blockellestreet 121",
    ShipPostCode: "8550 Zwevegem",
    ShipCountryCode: "BELGIUM",
    VatNo: "BE0450254796",
    PARMANo: "4662",
    GSDBID: "",
    Constatus: "Yes",
    RequestDate: new Date(),
  };
  const casePackagings: IPackagingNeed[] = [];
  for (let i = 0; i < 5; i++) {
    casePackagings.push({
      key: i,
      packaging: 20 + i,
      qtyWeekly: i + 1,
      qtyYearly: (i + 1) * 48,
      packagingName: `package${20 + i}`,
    });
  }
  const caseReceiving: IReceiverPlant[] = [];
  for (let i = 0; i < 5; i++) {
    caseReceiving.push({
      key: i,
      MasterID: i.toString(),
      PackagingAccountNo: i.toString(),
      CompanyName: `Company${i}`,
      City: "Tian Jin",
      CountryCode: "China",
    });
  }
  const caseConsequense: IConsequense[] = [];
  for (let i = 0; i < 5; i++) {
    caseConsequense.push({
      key: i,
      MasterID: i.toString(),
      Packaging: i.toString(),
      PackagingName: `package${i}`,
      Demand: i * 10,
    });
  }
  const initialState: IAppProps = {
    currentCase: dummyCase,
    packages: casePackagings,
    packageYear: new Date().getFullYear(),
    packageEditable: true,
    selectedPackages: [],
    receivingPlant: caseReceiving,
    consequenses: caseConsequense,
  };
  const [states, setStates] = React.useState(initialState);
  const packagingColumnBase = [
    {
      title: "Packaging",
      dataIndex: "packaging",
      width: "15%",
      editable: false,
    },
    {
      title: "No.(Qty)",
      dataIndex: "qtyWeekly",
      width: "30%",
      editable: false,
    },
    {
      title: "Packaging",
      dataIndex: "packaging",
      width: "15%",
      editable: true,
    },
    {
      title: "Packaging Name",
      dataIndex: "packagingName",
      width: "25%",
      editable: false,
    },
    { title: "No.(Qty)", dataIndex: "qtyYearly", width: "15%", editable: true },
  ];
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
  const packagingColumns = packagingColumnBase.map((col) => {
    return {
      ...col,
      onCell: (record: IPackagingNeed) => ({
        record,
        title: col.title,
        dataIndex: col.dataIndex,
        editing: states.currentCase.Status === "Case Created" && col.editable,
      }),
    };
  });
  const rowSelection = {
    hideSelectAll: true,
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IPackagingNeed[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
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
  const dateFormat = "DD/MM/YYYY";
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
    console.log("radio checked", e.target.value);
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
    e: number,
    key: React.Key,
    field: string
  ): void => {
    const packagesDup = [...states.packages];
    packagesDup
      .filter((packageDup) => packageDup.key === key)
      .forEach((item) => {
        switch (field) {
          case "packaging": {
            item.packaging = e;
            break;
          }
          case "qtyYearly": {
            item.qtyYearly = e;
            item.qtyWeekly = Math.ceil(e / 48);
            break;
          }
        }
      });
    console.log(states);
  };
  const onPackagingBlur = (): void => {
    setStates({ ...states });
  };
  const onAdd = (): void => {
    const packagesDup = [...states.packages];
    console.log(packagesDup);
    packagesDup.push({
      key: Number(packagesDup[packagesDup.length - 1].key) + 1,
    });
    setStates({ ...states, packages: packagesDup });
  };
  const onDelete = (): void => {
    const packagesDup = [...states.packages];
    states.selectedPackages.forEach((selectedPackage) => {
      packagesDup.splice(packagesDup.indexOf(selectedPackage), 1);
    });
    setStates({ ...states, packages: packagesDup });
  };
  const onStatusChange = (statusValue: string): void => {
    const caseTemp = states.currentCase;
    caseTemp.Status = statusValue;
    setStates({ ...states, currentCase: caseTemp });
    console.log(states.currentCase);
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
        RequestDate: moment(dateString, dateFormat).toDate(),
      },
    });
    console.log(states.currentCase.RequestDate);
  };
  //#endregion
  //#region methods
  const isEditableCommon = React.useCallback((): boolean => {
    return !(states.currentCase.Status === "Case Created");
  }, [states.currentCase]);
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const cellInput = (
    field: string,
    record: IPackagingNeed,
    editable: boolean
  ) => {
    const fieldEditable = !(editable && states.packageEditable);
    switch (field) {
      case "packaging":
        return (
          <InputNumber
            controls={false}
            value={record.packaging}
            onChange={(e) => onPackagingChange(e, record.key, "packaging")}
            readOnly={fieldEditable}
            onBlur={onPackagingBlur}
            bordered={!fieldEditable}
          />
        );
      case "qtyWeekly":
        return (
          <InputNumber
            value={record.qtyWeekly}
            readOnly={fieldEditable}
            bordered={!fieldEditable}
          />
        );
      case "qtyYearly":
        return (
          <InputNumber
            controls={false}
            value={record.qtyYearly}
            onChange={(e) => onPackagingChange(e, record.key, "qtyYearly")}
            readOnly={fieldEditable}
            onBlur={onPackagingBlur}
            bordered={!fieldEditable}
          />
        );
    }
  };
  const fields = ["packaging", "qtyWeekly", "qtyYearly"];
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
            <Button className={styles.fixedWidth}>Save</Button>
          </Col>
          <Col span={3} offset={2}>
            <Button className={styles.fixedWidth}>Cancel</Button>
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    defaultValue={states.currentCase.ShipPostCode}
                    disabled={isEditableCommon()}
                    onChange={(e) => {
                      onTextChange(e, "ShipPostCode");
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                      disabled={isEditableCommon()}
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
                      disabled={isEditableCommon()}
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
                      disabled={isEditableCommon()}
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
                      disabled={isEditableCommon()}
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
                    disabled={!states.packageEditable}
                  />
                  <Button
                    shape="circle"
                    className={styles.iconDelete}
                    icon={<DeleteOutlined rev={undefined} />}
                    onClick={onDelete}
                    disabled={!states.packageEditable}
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
                    dataSource={states.packages}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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
                    disabled={isEditableCommon()}
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

export default App;
