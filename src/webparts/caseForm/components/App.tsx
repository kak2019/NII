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
} from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { RadioChangeEvent, UploadProps } from "antd";
import * as React from "react";
import "antd/dist/antd.css";
import styles from "./CaseForm.module.scss";
import { INiiCaseItem } from "../../../common/model/niicase";

const App: React.FC = () => {
  //#region fields

  const dummyCase: INiiCaseItem = {
    ID: "1",
    Status: "Case Created",
  };
  const [currentCase, setCurrentCase] = React.useState(dummyCase);
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
  const [value, setValue] = React.useState(1);
  //#endregion
  //#region events
  const onApprovalChange = (e: RadioChangeEvent): void => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const onAdd = (): void => {
    console.log("add cliked");
  };
  const onDelete = (): void => {
    console.log("delete clicked");
  };
  const onStatusChange = (statusValue: string): void => {
    const caseTemp = currentCase;
    caseTemp.Status = statusValue;
    setCurrentCase(caseTemp);
    console.log(currentCase);
  };
  //#endregion
  //#region methods
  const isEditableCommon = React.useCallback(
    (currentCase): boolean => {
      return currentCase.Status === "Case Created";
    },
    [currentCase]
  );
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
            <Radio.Group onChange={onApprovalChange} value={value}>
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
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"FOMECO NV"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>Address(administrative):</Col>
              </Row>
              <Row>
                <Col span={6}>Street/P.O. Box:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"Blockellestreet 121"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Postal Code and City:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"8550 Zwevegem"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"BELGIUM"}
                    disabled={isEditableCommon(currentCase)}
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
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"Blockellestreet 121"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Postal Code and City:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"8550 Zwevegem"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"BELGIUM"}
                    disabled={isEditableCommon(currentCase)}
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
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"Blockellestreet 121"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Postal Code and City:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"8550 Zwevegem"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"BELGIUM"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col span={6}>VAT No:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"BE0450254796"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col span={6}>Supplier No:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"4662"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>GSDB ID:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"XXX"}
                    disabled={isEditableCommon(currentCase)}
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
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"Kris Lootens + Maika Vergote"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Email:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={
                      "Kris.lootens@fomeco.be;maika.vergote@fomeco.be"
                    }
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Phone No:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"+32(0)56 650 620"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Fax No:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"xxxxxx"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col className={styles.fontBold}>Receiving PLANT/RECEIVER:</Col>
              </Row>
              <Row>
                <Col span={6}>Packaging account no:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"BKKA-04"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Company Name:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"Thai Swedish Assembly Co LTD"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>City:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"Samutprakam"}
                    disabled={isEditableCommon(currentCase)}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={6}>Country Code:</Col>
                <Col>
                  <Input
                    className={styles.inputStyle}
                    defaultValue={"Thailand"}
                    disabled={isEditableCommon(currentCase)}
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
                    defaultValue={2024}
                    className={styles.fixedWidth}
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
                  <PlusCircleOutlined
                    rev={undefined}
                    onSelect={onAdd}
                    className={styles.iconPlus}
                  />
                  <DeleteOutlined
                    rev={undefined}
                    onSelect={onDelete}
                    className={styles.iconDelete}
                  />
                </Col>
              </Row>
              <Row className={styles.marginTop}>
                <Col span={12}>Two Weekly need:</Col>
                <Col>Yearly need:</Col>
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
