/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import "antd/dist/antd.css";
import styles from "../PackageList.module.scss";
import { Button, Card, Col, Input, Row, message } from "antd";
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

const PackageListView: React.FC = () => {
  //#region interfaces
  //#endregion
  //#region fields
  const [, , packagingNeeds] = usePackagings();
  const packagingNeedsSorted: IPackaging[] = JSON.parse(
    JSON.stringify([...packagingNeeds])
  );
  packagingNeedsSorted.sort((a, b) => {
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
  const [currentPackagingNeeds, setCurrentPackagingNeeds] =
    React.useState(packagingNeedsSorted);
  const [queryParma, setQueryParma] = React.useState("");
  const [querySupplierName, setQuerySupplierName] = React.useState("");
  const [queryYear, setQueryYear] = React.useState("");
  const [queryCaseID, setQueryCaseID] = React.useState("");
  const columns: IColumn[] = [
    {
      key: "CaseId",
      name: "Case ID",
      fieldName: "CaseID",
      minWidth: 50,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "SupplierNo",
      name: "Parma",
      fieldName: "SupplierNo",
      minWidth: 60,
      maxWidth: 200,
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
      isResizable: true,
    },
    {
      key: "Packaging",
      name: "Packaging",
      fieldName: "Packaging",
      minWidth: 100,
      maxWidth: 200,
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
      maxWidth: 200,
      isResizable: true,
    },
  ];
  let groups: IGroup[] = [];
  currentPackagingNeeds.forEach((item, index) => {
    let packageGroup = groups.filter(
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
      groups.push(packageGroup);
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
  //#endregion
  //#region methods
  const reGroup = async (): Promise<void> => {
    groups = [];
    currentPackagingNeeds.forEach((item, index) => {
      let packageGroup = groups.filter(
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
        groups.push(packageGroup);
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
  };
  //#endregion
  //#region events
  const onSearchName = (): void => {
    const items = packagingNeeds.filter((i) => i.SupplierNo === queryParma);
    if (items.length > 0) {
      setQuerySupplierName(items[0].SupplierName);
      return;
    }
    setQuerySupplierName("");
  };
  const onReset = (): void => {
    setQueryCaseID("");
    setQueryParma("");
    setQuerySupplierName("");
    setQueryYear("");
  };
  const onSearchPackagings = async (): Promise<void> => {
    if (queryParma.trim().length > 0 && querySupplierName.length === 0) {
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
    let queryPackagingNeeds: IPackaging[] = JSON.parse(
      JSON.stringify([...packagingNeeds])
    );
    if (queryParma.length > 0) {
      queryPackagingNeeds = queryPackagingNeeds.filter(
        (i) => i.SupplierNo === queryParma
      );
    }
    if (queryCaseID.length > 0) {
      queryPackagingNeeds = queryPackagingNeeds.filter(
        (i) => i.CaseID.indexOf(queryCaseID) !== -1
      );
    }
    if (queryYear.length > 0) {
      queryPackagingNeeds = queryPackagingNeeds.filter(
        (i) => i.Year.indexOf(queryYear) !== -1
      );
    }
    queryPackagingNeeds.sort((a, b) => {
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
    await reGroup();
    setCurrentPackagingNeeds(queryPackagingNeeds);
    await message.success("Searching Success");
  };
  const onViewAll = (): void => {
    setQueryCaseID("");
    setQueryParma("");
    setQuerySupplierName("");
    setQueryYear("");
    setCurrentPackagingNeeds(packagingNeedsSorted);
  };
  //#endregion
  //#region components
  //#endregion
  return (
    <div>
      <Row className={styles.title}>
        <Col>Case Handling</Col>
      </Row>
      <Row className={styles.rowContent}>
        <Col span={24}>
          <Card bordered={false}>
            <Row className={styles.rowContent} align="middle">
              <Col span={2}>Parma</Col>
              <Col span={3}>
                <Input
                  value={queryParma}
                  onChange={(e) => setQueryParma(e.target.value)}
                  onBlur={onSearchName}
                />
              </Col>
              <Col offset={1} span={4}>
                Supplier Name
              </Col>
              <Col span={5}>
                <Input
                  value={querySupplierName}
                  disabled={true}
                  style={{ color: "black" }}
                />
              </Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Col span={2}>Year</Col>
              <Col span={3}>
                <Input
                  value={queryYear}
                  onChange={(e) => setQueryYear(e.target.value)}
                />
              </Col>
              <Col offset={1} span={4}>
                Case ID
              </Col>
              <Col span={6}>
                <Input
                  value={queryCaseID}
                  onChange={(e) => setQueryCaseID(e.target.value)}
                />
              </Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Col offset={13} span={3}>
                <Button
                  className={styles.buttonWrapper}
                  style={{
                    borderRadius: "6px",
                  }}
                  onClick={onReset}
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
                    background: "#00829B",
                  }}
                  onClick={onSearchPackagings}
                >
                  Search
                </Button>
              </Col>
              <Col span={5}>
                <Button
                  className={styles.buttonWrapper}
                  style={{
                    borderRadius: "6px",
                    color: "#fff",
                    background: "#00829B",
                  }}
                  onClick={onViewAll}
                >
                  View all packaging
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
              <Col>
                <DetailsList
                  items={currentPackagingNeeds}
                  columns={columns}
                  groups={groups}
                  compact={true}
                  constrainMode={ConstrainMode.unconstrained}
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
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PackageListView;
