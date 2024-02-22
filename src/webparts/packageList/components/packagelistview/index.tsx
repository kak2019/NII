/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import "antd/dist/antd.css";
import styles from "../PackageList.module.scss";
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Spin,
  message,
} from "antd";
import { Stack } from "@fluentui/react/lib/Stack";
import excelIcon from "../../assets/icons8-excel-48.png";
import { usePackagings } from "../../../../common/hooks/usePackagings";
import {
  DetailsList,
  IColumn,
  ConstrainMode,
  GroupHeader,
  SelectionMode,
  IGroup,
} from "@fluentui/react";
import { IPackaging } from "../../../../common/model/packagingneed";
import DebouncedInputParma from "./debounceinputparma";

const PackageListView: React.FC = () => {
  //#region interfaces
  //#endregion
  //#region fields
  const [
    isFetching,
    errorMessage,
    packagingNeeds,
    packagingNeedsAll,
    supplierNameResult,
    fetchAllPackagingNeeds,
    fetchSupplierNameByParma,
    fetchPackagingNeeds,
    clearAllData,
  ] = usePackagings();
  const [currentPackagingNeeds, setCurrentPackagingNeeds] = React.useState([]);
  const [listGroups, setListGroups] = React.useState([]);
  const [queryParma, setQueryParma] = React.useState("");
  const [querySupplierName, setQuerySupplierName] = React.useState("-");
  const [queryYear, setQueryYear] = React.useState("");
  const [queryCaseID, setQueryCaseID] = React.useState("");
  const [dataKey, setDataKey] = React.useState(0);
  const [resetKey, setResetKey] = React.useState(Date.now().toString());
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const columns: IColumn[] = [
    {
      key: "CaseId",
      name: "Case ID",
      fieldName: "CaseID",
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
    },
    {
      key: "SupplierNo",
      name: "Parma",
      fieldName: "SupplierNo",
      minWidth: 60,
      maxWidth: 60,
      isResizable: true,
    },
    {
      key: "SupplierName",
      name: "Supplier Name",
      fieldName: "SupplierName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "Year",
      name: "Year",
      fieldName: "Year",
      minWidth: 50,
      maxWidth: 50,
      isResizable: true,
    },
    {
      key: "Packaging",
      name: "Packaging",
      fieldName: "Packaging",
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
    },
    {
      key: "PackagingName",
      name: "Packaging Name",
      fieldName: "PackagingName",
      minWidth: 200,
      isResizable: true,
    },
    {
      key: "YearlyDemand",
      name: "Yearly Demand",
      fieldName: "YearlyDemand",
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
    },
  ];
  //#endregion
  //#region methods
  function convertToCSV(objArray: any[]) {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    // Extract headers
    const headers = Object.keys(array[0]);
    str += '"' + headers.join('","') + '"\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (const index in array[i]) {
        if (Object.prototype.hasOwnProperty.call(array[i], index)) {
          if (line !== "") line += ",";
          // Enclose field in double quotes and escape existing double quotes
          const value = array[i][index].toString().replace(/"/g, '""');
          line += '"' + value + '"';
        }
      }
      str += line + "\r\n";
    }
    return str;
  }
  // Function to trigger download
  function downloadCSV() {
    const csvData = new Blob([convertToCSV(packagingNeedsAll)], {
      type: "text/csv;charset=utf-8;",
    });
    const csvURL = URL.createObjectURL(csvData);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", "Packaging Needs");
    tempLink.click();
  }
  React.useEffect(() => {
    if (isDownloading) {
      downloadCSV();
      setIsDownloading(false);
    }
  }, [packagingNeedsAll]);
  //#endregion
  //#region events
  const onReset = (): void => {
    setQueryCaseID("");
    setQueryParma("");
    setQuerySupplierName("-");
    setQueryYear("");
    setResetKey(Date.now().toString());
  };
  React.useEffect(() => {
    if (supplierNameResult !== "") {
      setQuerySupplierName(supplierNameResult);
    } else {
      setQuerySupplierName("-");
    }
  }, [supplierNameResult]);
  const onParmaChange = (parmaNum: string): void => {
    setQueryParma(parmaNum);
    fetchSupplierNameByParma(parmaNum);
  };
  React.useEffect(() => {
    const packagingNeedsSortedAll: IPackaging[] = JSON.parse(
      JSON.stringify([...packagingNeeds])
    );
    packagingNeedsSortedAll.sort((a, b) => {
      if (a.SupplierNo < b.SupplierNo) {
        return -1;
      }
      if (a.SupplierNo > b.SupplierNo) {
        return 1;
      }
      if (a.Year < b.Year) {
        return -1;
      }
      if (a.Year > b.Year) {
        return 1;
      }
      return 0;
    });
    const groupsTemp: IGroup[] = [];
    packagingNeedsSortedAll.forEach((item, index) => {
      let packageGroup = groupsTemp.filter(
        (group) => group.name === item.SupplierNo
      )[0];
      if (!packageGroup) {
        packageGroup = {
          key: item.SupplierNo,
          name: item.SupplierNo,
          startIndex: index,
          count: 0,
          level: 0,
          children: [],
        };
        groupsTemp.push(packageGroup);
      }
      let userGroup = packageGroup.children.filter(
        (group) => group.name === item.Year
      )[0];
      if (!userGroup) {
        userGroup = {
          key: item.Year,
          name: item.Year,
          startIndex: index,
          count: 1,
          level: 1,
        };
        packageGroup.children.push(userGroup);
      } else {
        userGroup.count++;
      }
      packageGroup.count++;
    });
    setListGroups(groupsTemp);
    setCurrentPackagingNeeds(packagingNeedsSortedAll);
    setDataKey((prevKey) => prevKey + 1);
    setIsLoading(false);
  }, [packagingNeeds]);
  const onDownLoad = async (): Promise<void> => {
    setIsDownloading(true);
    if (packagingNeedsAll.length === 0) {
      fetchAllPackagingNeeds();
    } else {
      downloadCSV();
      setIsDownloading(false);
    }
  };
  const onSearchPackagings = async (): Promise<void> => {
    if (queryParma.trim().length > 0 && querySupplierName === "-") {
      await message.error("Input Parma does not exist");
      return;
    }
    if (
      queryParma.trim().length === 0 &&
      queryYear.trim().length === 0 &&
      queryCaseID.trim().length === 0
    ) {
      await message.warning("Please enter the search criteria first.");
      return;
    }
    setIsLoading(true);
    const ParmaNum = queryParma.trim().length === 0 ? "" : queryParma;
    const Year = queryYear.trim().length === 0 ? "" : queryYear;
    const CaseID = queryCaseID.trim().length === 0 ? "" : queryCaseID;
    fetchPackagingNeeds(ParmaNum, Year, CaseID);
  };
  //#endregion
  //#region components
  //#endregion
  return (
    <div>
      <Row align={"middle"}>
        <Col className={styles.title}>Case Handling</Col>
      </Row>
      <Row className={styles.rowContent}>
        <Col span={24}>
          <Card bordered={false}>
            <Row className={styles.rowContent} align="middle">
              <Col span={3}>Parma</Col>
              <Col span={6}>
                <DebouncedInputParma
                  defaultValue={queryParma}
                  onValueChange={onParmaChange}
                  resetKey={resetKey}
                />
              </Col>
              <Col offset={2} span={3}>
                Supplier Name
              </Col>
              <Col span={6}>{querySupplierName}</Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Col span={3}>Year</Col>
              <Col span={6}>
                <Input
                  style={{
                    borderRadius: "6px",
                  }}
                  value={queryYear}
                  onChange={(e) => setQueryYear(e.target.value)}
                />
              </Col>
              <Col offset={2} span={3}>
                Case ID
              </Col>
              <Col span={6}>
                <Input
                  style={{
                    borderRadius: "6px",
                  }}
                  value={queryCaseID}
                  onChange={(e) => setQueryCaseID(e.target.value)}
                />
              </Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Col offset={14} span={3}>
                <Button
                  className={styles.buttonWrapper}
                  style={{
                    borderRadius: "6px",
                    color: isLoading ? "#fff" : "black",
                    background: isLoading ? "lightgrey" : "white",
                  }}
                  onClick={onReset}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </Col>
              <Col span={3}>
                <Button
                  className={styles.buttonWrapper}
                  style={{
                    borderRadius: "6px",
                    color: "#fff",
                    background: isLoading ? "lightgrey" : "#00829B",
                  }}
                  onClick={onSearchPackagings}
                  disabled={isLoading}
                >
                  Search
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  onClick={onDownLoad}
                  style={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    background: "White",
                    color: "#4caf4f",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={excelIcon}
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  />{" "}
                  Download All
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row className={styles.sectionTwo}>
        <Col span={24}>
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                <div>
                  <DetailsList
                    key={dataKey}
                    items={isLoading ? [] : currentPackagingNeeds}
                    columns={columns}
                    groups={isLoading ? [] : listGroups}
                    compact={true}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    selectionMode={SelectionMode.none}
                    groupProps={{
                      onRenderHeader: (props) => {
                        if (props) {
                          return (
                            <GroupHeader
                              {...props}
                              onRenderTitle={(props) => {
                                if (props) {
                                  return (
                                    <span
                                      style={{
                                        fontWeight: 600,
                                      }}
                                    >
                                      {props.group.level === 0 && "Parma"}
                                      {props.group.level === 1 && "Year"} (
                                      {props.group.name})
                                    </span>
                                  );
                                }
                                return null;
                              }}
                            />
                          );
                        }
                        return null;
                      },
                    }}
                    onRenderDetailsFooter={() => (
                      <>
                        {!isLoading && currentPackagingNeeds.length === 0 && (
                          <Stack
                            verticalAlign="center"
                            style={{
                              height: "500px",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ fontSize: "22px", fontWeight: 600 }}>
                              No data can be displayed
                            </span>
                            <span
                              style={{ fontSize: "15px", marginTop: "14px" }}
                            >
                              Please enter valid criteria to search data
                            </span>
                          </Stack>
                        )}
                        {isLoading && (
                          <Spin tip="Loading..." className={styles.iconwrapper}>
                            <Alert
                              className={styles.alertStyle}
                              message=""
                              description=""
                              type="info"
                            />
                          </Spin>
                        )}
                      </>
                    )}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        open={isDownloading}
        closable={false}
        footer={null}
        width={500}
        style={{ borderRadius: "6px", overflow: "hidden", paddingBottom: 0 }}
      >
        <Spin tip="Downloading..." className={styles.iconwrapper}>
          <Alert
            className={styles.alertStyle}
            message=""
            description=""
            type="info"
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default PackageListView;
