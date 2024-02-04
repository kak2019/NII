/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo } from "react";
import * as React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PackageListView from "./packagelistview";
import "./App.css";
import styles from "./PackageList.module.scss";
import { usePackagings } from "../../../common/hooks/usePackagings";
import { Alert, Col, Divider, Row, Spin } from "antd";
import AppContext from "../../../common/AppContext";
import { PackagingStatus } from "../../../common/features/packagings/packagingSlice";
export default memo(function App() {
  const [isFetching, errorMessage, packagingNeeds, fetchPackagingNeeds] =
    usePackagings();
  const [initial, setInitial] = React.useState(false);
  const appContext = React.useContext(AppContext);
  const isLoadingCase = isFetching === PackagingStatus.Loading;
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async function waitForData() {
      setInitial(true);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        fetchPackagingNeeds();
        break;
      }
      setInitial(false);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    waitForData().catch(console.error);
  }, []);
  return (
    <>
      <div className={styles.listWrapper}>
        <Row align="middle">
          <Col offset={2}>
            <a
              href={`${appContext.context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`}
              style={{ color: "#00829B" }}
            >
              <ArrowLeftOutlined rev={undefined} />
              <span>Return to home</span>
            </a>
          </Col>
        </Row>
        <Row>
          <Col offset={2} span={20}>
            {(isLoadingCase || initial) && (
              <Spin tip="Loading...">
                <Alert
                  className={styles.alertStyle}
                  message=""
                  description=""
                  type="info"
                />
              </Spin>
            )}
            {errorMessage?.length !== 0 && !initial && (
              <Alert
                message="Error"
                description={errorMessage}
                type="error"
                showIcon
              />
            )}
            {errorMessage?.length === 0 && !isLoadingCase && !initial && (
              <PackageListView />
            )}
          </Col>
        </Row>
        <Divider />
      </div>
    </>
  );
});
