/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import "antd/dist/antd.css";
import styles from "../PackageList.module.scss";
import { Button, Col, Row } from "antd";
import { usePackagings } from "../../../../common/hooks/usePackagings";
import {
  ListView,
  IViewField,
  GroupOrder,
  IGrouping,
} from "@pnp/spfx-controls-react/lib/ListView";

const PackageListView: React.FC = () => {
  //#region interfaces
  //#endregion
  //#region fields
  const [isFetching, errorMessage, packagingNeeds, fetchPackagingNeeds] =
    usePackagings();
  const [currentPackagingNeeds, setCurrentPackagingNeeds] =
    React.useState(packagingNeeds);
  const groupByFields: IGrouping[] = [
    {
      name: "SupplierNo",
      order: GroupOrder.ascending,
    },
    {
      name: "Packaging",
      order: GroupOrder.descending,
    },
  ];
  const viewFields: IViewField[] = [
    {
      name: "CaseID",
      displayName: "Case ID",
      sorting: false,
      minWidth: 75,
      maxWidth: 75,
      isResizable: false,
    },
    {
      name: "SupplierNo",
      displayName: "Supplier No",
      sorting: false,
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
    },
    {
      name: "SupplierName",
      displayName: "Supplier Name",
      sorting: false,
      minWidth: 100,
      maxWidth: 100,
      isResizable: false,
    },
    {
      name: "Year",
      displayName: "Year",
      sorting: false,
      minWidth: 75,
      maxWidth: 75,
      isResizable: false,
    },
    {
      name: "Packaging",
      displayName: "Packaging",
      sorting: false,
      minWidth: 75,
      maxWidth: 75,
      isResizable: false,
    },
    {
      name: "YearlyDemand",
      displayName: "Yearly Demand",
      sorting: false,
      minWidth: 75,
      maxWidth: 75,
      isResizable: false,
    },
  ];
  //#endregion
  //#region methods
  const SearchPackagings = async (): Promise<void> => {
    fetchPackagingNeeds();
    return;
  };
  //#endregion
  //#region events
  const onSearchPackagings = async (): Promise<void> => {
    await SearchPackagings().then(() => {
      setCurrentPackagingNeeds(packagingNeeds);
    });
    return;
  };
  //#endregion
  //#region components

  //#endregion
  return (
    <div className={styles.listWrapper}>
      <Row>
        <Col>
          <Button onClick={onSearchPackagings}>Search</Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <ListView
            items={currentPackagingNeeds}
            viewFields={viewFields}
            iconFieldName="FileRef"
            compact={true}
            groupByFields={groupByFields}
            stickyHeader={true}
            className={styles.listWrapper}
            listClassName={styles.list}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PackageListView;
