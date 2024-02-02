/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import "antd/dist/antd.css";
import styles from "../PackageList.module.scss";
import { Button, Col, Row } from "antd";
import { usePackagings } from "../../../../common/hooks/usePackagings";
import groupBy from "lodash/groupBy";

const PackageListView: React.FC = () => {
  //#region interfaces
  //#endregion
  //#region fields
  const [isFetching, errorMessage, packagingNeeds, fetchPackagingNeeds] =
    usePackagings();
  const [currentPackagingNeeds, setCurrentPackagingNeeds] =
    React.useState(packagingNeeds);

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
        <Col span={24}></Col>
      </Row>
    </div>
  );
};

export default PackageListView;
