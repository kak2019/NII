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
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { RadioChangeEvent, UploadProps } from "antd";
import * as React from "react";
import "antd/dist/antd.css";
import styles from "./CaseForm.module.scss";
import { INiiCaseItem } from "../../../common/model/niicase";
import { IPackagingNeed } from "../../../common/model/packagingneed";
import { IAppProps } from "./IAppProps";

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
    Status: "Case Created",
  };
  const casePackagings: IPackagingNeed[] = [];
  for (let i = 0; i < 5; i++) {
    casePackagings.push({
      key: i,
      packaging: 20 + 5 * i,
      qtyWeekly: i + 1,
      qtyYearly: (i + 1) * 48,
    });
  }
  const packageArray: IPackagingNeed[] = [];
  const initialState: IAppProps = {
    currentCase: dummyCase,
    packages: casePackagings,
    packageYear: new Date().getFullYear(),
    packageEditable: true,
    selectedPackages: packageArray,
    radioValue: 1,
  };
  const [states, setStates] = React.useState(initialState);
  const columns = [
    {
      title: "Packaging",
      dataIndex: "packaging",
      width: "20%",
      editable: false,
    },
    {
      title: "No.(Qty)",
      dataIndex: "qtyWeekly",
      width: "40%",
      editable: false,
    },
    {
      title: "Packaging",
      dataIndex: "packaging",
      width: "20%",
      editable: true,
    },
    { title: "No.(Qty)", dataIndex: "qtyYearly", width: "20%", editable: true },
  ];
  const packagingColumns = columns.map((col) => {
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
  //#endregion
  //#region events
  const onApprovalChange = (e: RadioChangeEvent): void => {
    console.log("radio checked", e.target.value);
    setStates({ ...states, radioValue: e.target.value });
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
    console.log("Dup:", packagesDup);
    console.log("State:", states.packages);
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
    switch (field) {
      case "packaging":
        return (
          <InputNumber
            controls={false}
            value={record.packaging}
            onChange={(e) => onPackagingChange(e, record.key, "packaging")}
            disabled={!(editable && states.packageEditable)}
            onBlur={onPackagingBlur}
          />
        );
      case "qtyWeekly":
        return (
          <InputNumber
            controls={false}
            value={record.qtyWeekly}
            onChange={(e) => onPackagingChange(e, record.key, "qtyWeekly")}
            disabled={!(editable && states.packageEditable)}
          />
        );
      case "qtyYearly":
        return (
          <InputNumber
            controls={false}
            value={record.qtyYearly}
            onChange={(e) => onPackagingChange(e, record.key, "qtyYearly")}
            disabled={!(editable && states.packageEditable)}
            onBlur={onPackagingBlur}
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
          <Col>24001</Col>
        </Row>
        <Row className={styles.rowContent}>
          <Col span={6}>Creation Date:</Col>
          <Col>data</Col>
        </Row>
        <Row className={styles.rowContent} align="middle">
          <Col span={6}>Status</Col>
          <Col span={8}>
            <Select
              onChange={onStatusChange}
              defaultValue="Case Created"
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
            <Radio.Group onChange={onApprovalChange} value={states.radioValue}>
              <Radio value={1}>Approve</Radio>
              <Radio value={0}>Reject</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </div>
      <Divider />
      <Row className={styles.rowContent}>
        <Col span={24}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Supplier Information" key="1">
              <Row className={styles.marginTop}>
                <Col span={6}>Company Name:</Col>
                <Col span={8}>
                  <Input
                    maxLength={200}
                    className={styles.inputStyle}
                    defaultValue={"FOMECO NV"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>Address(administrative):</Col>
              </Row>
              <Row>
                <Col span={6}>Street/P.O. Box:</Col>
                <Col span={8}>
                  <Input
                    maxLength={150}
                    className={styles.inputStyle}
                    defaultValue={"Blockellestreet 121"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Postal Code and City:</Col>
                <Col span={8}>
                  <Input
                    maxLength={50}
                    className={styles.inputStyle}
                    defaultValue={"8550 Zwevegem"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col span={8}>
                  <Input
                    maxLength={20}
                    className={styles.inputStyle}
                    defaultValue={"BELGIUM"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>
                  Invoice address(if other than above):
                </Col>
              </Row>
              <Row>
                <Col span={6}>Street/P.O. Box:</Col>
                <Col span={8}>
                  <Input
                    maxLength={150}
                    className={styles.inputStyle}
                    defaultValue={"Blockellestreet 121"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Postal Code and City:</Col>
                <Col span={8}>
                  <Input
                    maxLength={50}
                    className={styles.inputStyle}
                    defaultValue={"8550 Zwevegem"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col span={8}>
                  <Input
                    maxLength={20}
                    className={styles.inputStyle}
                    defaultValue={"BELGIUM"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>
                  Delivery address(empty packaging):
                </Col>
              </Row>
              <Row>
                <Col span={6}>Street/P.O. Box:</Col>
                <Col span={8}>
                  <Input
                    maxLength={150}
                    className={styles.inputStyle}
                    defaultValue={"Blockellestreet 121"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Postal Code and City:</Col>
                <Col span={8}>
                  <Input
                    maxLength={50}
                    className={styles.inputStyle}
                    defaultValue={"8550 Zwevegem"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col span={8}>
                  <Input
                    maxLength={20}
                    className={styles.inputStyle}
                    defaultValue={"BELGIUM"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col span={6}>VAT No:</Col>
                <Col span={8}>
                  <Input
                    maxLength={20}
                    className={styles.inputStyle}
                    defaultValue={"BE0450254796"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col span={6}>Supplier No:</Col>
                <Col span={8}>
                  <Input
                    maxLength={7}
                    className={styles.inputStyle}
                    defaultValue={"4662"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>GSDB ID:</Col>
                <Col span={8}>
                  <Input
                    maxLength={10}
                    className={styles.inputStyle}
                    defaultValue={"XXX"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Packaging Contact" key="2">
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>Packaging Contact Person:</Col>
              </Row>
              <Row>
                <Col span={6}>First and Last Name:</Col>
                <Col span={8}>
                  <Input
                    maxLength={50}
                    className={styles.inputStyle}
                    defaultValue={"Kris Lootens + Maika Vergote"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Email:</Col>
                <Col span={8}>
                  <Input
                    maxLength={50}
                    className={styles.inputStyle}
                    defaultValue={
                      "Kris.lootens@fomeco.be;maika.vergote@fomeco.be"
                    }
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Phone No:</Col>
                <Col span={8}>
                  <Input
                    type="tel"
                    maxLength={20}
                    className={styles.inputStyle}
                    defaultValue={"+32(0)56 650 620"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Fax No:</Col>
                <Col span={8}>
                  <Input
                    maxLength={20}
                    className={styles.inputStyle}
                    defaultValue={"xxxxxx"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>Receiving PLANT/RECEIVER:</Col>
              </Row>
              <Row>
                <Col span={6}>Packaging account no:</Col>
                <Col span={8}>
                  <Input
                    maxLength={10}
                    className={styles.inputStyle}
                    defaultValue={"BKKA-04"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Company Name:</Col>
                <Col span={8}>
                  <Input
                    maxLength={200}
                    className={styles.inputStyle}
                    defaultValue={"Thai Swedish Assembly Co LTD"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>City:</Col>
                <Col span={8}>
                  <Input
                    maxLength={50}
                    className={styles.inputStyle}
                    defaultValue={"Samutprakam"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col span={8}>
                  <Input
                    maxLength={5}
                    className={styles.inputStyle}
                    defaultValue={"Thailand"}
                    disabled={isEditableCommon()}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Consequences for other supplier" key="3">
              Content of Tab Pane 3
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
                <Col span={11} offset={1}>
                  Weekly need:
                </Col>
                <Col>Yearly need:</Col>
              </Row>
              <Row>
                <Col span={20}>
                  <Table
                    pagination={false}
                    rowSelection={rowSelection}
                    components={{ body: { cell: EditableCell } }}
                    dataSource={states.packages}
                    columns={packagingColumns}
                    bordered={false}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Issuer Information" key="5">
              Content of Tab Pane 5
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default App;
