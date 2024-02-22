/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo } from "react";
import * as React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PackageListView from "./packagelistview";
import "./App.css";
import styles from "./PackageList.module.scss";
import { Col, Divider, Row } from "antd";
import AppContext from "../../../common/AppContext";
import { usePackagings } from "../../../common/hooks/usePackagings";

export default memo(function App() {
  const [, , , , , , , , clearAllData] = usePackagings();
  const appContext = React.useContext(AppContext);
  return (
    <>
      <div className={styles.listWrapper}>
        <Row align="middle" style={{ height: 40 }}>
          <Col offset={2}>
            <a
              href={`${appContext.context.pageContext.web.absoluteUrl}/SitePages/CollabHome.aspx`}
              style={{ color: "#00829B" }}
              onClick={(e) => {
                clearAllData();
              }}
            >
              <ArrowLeftOutlined rev={undefined} />
              <span>Return to home</span>
            </a>
          </Col>
        </Row>
        <Row>
          <Col offset={2} span={20}>
            <PackageListView />
          </Col>
        </Row>
        <Divider />
      </div>
    </>
  );
});
