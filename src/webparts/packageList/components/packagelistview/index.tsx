/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import "antd/dist/antd.css";
import styles from "../PackageList.module.scss";
import { Button, Card, Col, Input, Row } from "antd";
import { usePackagings } from "../../../../common/hooks/usePackagings";

const PackageListView: React.FC = () => {
  //#region interfaces
  //#endregion
  //#region fields
  const [, , packagingNeeds] = usePackagings();
  const [currentPackagingNeeds, setCurrentPackagingNeeds] =
    React.useState(packagingNeeds);
  //#endregion
  //#region methods
  React.useEffect(() => {
    setCurrentPackagingNeeds(packagingNeeds);
  });
  //#endregion
  //#region events
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
              <Col span={4}>Parma</Col>
              <Col span={4}>
                <Input />
              </Col>
              <Col offset={1} span={5}>
                Supplier Name
              </Col>
              <Col span={5}>
                <Input />
              </Col>
            </Row>
            <Row className={styles.rowContent} align="middle">
              <Row className={styles.rowContent} align="middle">
                <Col span={4}>Year</Col>
                <Col span={4}>
                  <Input />
                </Col>
                <Col offset={1} span={5}>
                  Case ID
                </Col>
                <Col span={7}>
                  <Input />
                </Col>
              </Row>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row className={styles.sectionTwo}>
        <Col span={24}>
          <Card bordered={false}></Card>
        </Col>
      </Row>
    </div>
  );
};

export default PackageListView;
